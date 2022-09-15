import { rename as renameFile } from 'fs/promises';

import env from "$constants/env";

import { delay } from '$utils/time-utils';
import { getStorePath, updateMetaForFile } from "$utils/file-utils";
import { uploadsProcessingStatus } from "$storages/indexes/indexation-status";
import { uploadsMetaIndex } from "$storages/indexes/meta-index";


export async function processUploadsIndex() {
	const statusStorage = uploadsProcessingStatus;

	console.log('processUploadsIndex', statusStorage.toObject());

	if (statusStorage.getItem('processingStarted') && !statusStorage.getItem('processingFinished')) {
		return false;
	}

	statusStorage.setItem('processingStarted', Date.now());
	statusStorage.setItem('processingFinished', undefined);
	statusStorage.setItem('processedFiles', 0);

	console.log('processUploadsIndex', statusStorage.toObject());
	async function processUploadsEntry({ hash, meta, path }, queue) {
		statusStorage.setItem('queue', queue);

		console.log(`processing file "${path}" / ${hash}`);
		const storePath = await getStorePath(path);
		console.log(`trying to move "${path}" to "${storePath}"..`);
		await renameFile(path, storePath);
		console.log(`updating meta for "${storePath}"`)
		await updateMetaForFile(storePath, meta);

		statusStorage.updateItem('processedFiles', (count = 0) => count + 1);
	}

	const queue = uploadsMetaIndex.getEntries();
	while(queue.length) {
		const entry = queue.shift();
		await processUploadsEntry(entry, queue);
		uploadsMetaIndex.remove(entry);
		await delay(2);
	}

	statusStorage.setItem('processingFinished', Date.now());
}
