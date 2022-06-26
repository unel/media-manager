import { delay } from '$utils/time-utils';
import { computeFileHash } from './compute-file-hash';
import { getFileMeta } from './index';
import { walkDirItems } from "./walk-dir-Items";

import env from '$constants/env';
import { uploadsIndexationStatus } from '$storages/indexes/indexation-status';
import { uploadsMetaIndex } from '$storages/indexes/meta-index';


export async function buildMetaIndex(rootDir, statusStorage, indexStorage) {
	return new Promise(async (resolve) => {
		console.log('buildMetaIndex', rootDir, statusStorage.toObject());

		if (statusStorage.getItem('buildStarted') && !statusStorage.getItem('buildFinished')) {
			return resolve(false);
		}

		await Promise.all([
			statusStorage.loadData?.(),
			indexStorage.loadData?.(),
		]);

		statusStorage.setItem('rootDir', rootDir);
		statusStorage.setItem('buildStarted', Date.now());
		statusStorage.setItem('buildFinished', undefined);
		statusStorage.setItem('indexedFiles', 0);

		console.log('buildMetaIndex', rootDir, statusStorage.toObject());
		async function buildIndexForEntry(entry) {
			statusStorage.setItem('queue', entry.queue);

			const path = entry.path;
			const hash = await computeFileHash(path);
			const meta = await getFileMeta(path);

			indexStorage.add({ path, hash, meta });
			statusStorage.updateItem('indexedFiles', (count = 0) => count + 1);
		}

		async function walkIndexCb(data, next) {
			if (data === null) {
				statusStorage.setItem('buildFinished', Date.now());
				return resolve(true);
			}

			await buildIndexForEntry(data);

			await delay(2);
			next();
		}

		walkDirItems(rootDir, walkIndexCb);
	});
}


export async function buildUploadsIndex() {
	return buildMetaIndex(env.UPLOAD_ROOT, uploadsIndexationStatus, uploadsMetaIndex);
}
