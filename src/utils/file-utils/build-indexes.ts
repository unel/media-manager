import { indexationQueue } from "$storages/indexes/indexation-queue";
import { pathsByHash } from "$storages/indexes/paths-by-hash";
import { hashByPath } from "$storages/indexes/hash-by-path";
import { metaByHash } from "$storages/indexes/meta-by-hash";
import { delay } from '$utils/time-utils';
import { computeFileHash } from './compute-file-hash';
import { getFileMeta } from './index';
import { computeWalkDirItemsQueueSize } from "./compute-walk-dir-items-queue-size";
import { walkItemsByEntries } from "./walk-items-by-entries";
import { walkDirItems } from "./walk-dir-Items";


export async function buildIndexes(rootDir, statusStorage) {
	if (statusStorage.getItem('buildStarted') && !statusStorage.getItem('buildFinished')) {
		console.warn('wowowo, it is dangerous!!');
		return;
	}

	await Promise.all([
		hashByPath.loadData(),
		pathsByHash.loadData(),
		metaByHash.loadData(),
		indexationQueue.loadData(),
	])

	statusStorage.setItem('rootDir', rootDir);
	statusStorage.setItem('buildStarted', Date.now());
	statusStorage.setItem('buildFinished', undefined);
	statusStorage.setItem('indexedFiles', 0);


	async function buildIndexForEntry(entry) {
		indexationQueue.setValue(entry.queue);

		const path = entry.path;
		const hash = await computeFileHash(path);

		await pathsByHash.add({ hash, path });
		await hashByPath.add({ hash, path });

		const meta = await getFileMeta(path);
		metaByHash.add({ hash, meta });

		statusStorage.updateItem('indexedFiles', (count = 0) => count + 1);
	}

	async function walkIndexCb(data, next) {
		if (data === null) {
			statusStorage.setItem('buildFinished', Date.now());
			return;
		}

		await buildIndexForEntry(data);

		await delay(2);
		next();
	}

	const queue = indexationQueue.getValue()
	if (queue) {
		walkItemsByEntries(queue, walkIndexCb);
	} else {
		walkDirItems(rootDir, walkIndexCb);
	}
}
