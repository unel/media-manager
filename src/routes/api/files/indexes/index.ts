import env from '$constants/env';
import { indexationStatus } from "$storages/indexes/indexation-status";
import { buildIndexes } from "$utils/file-utils/build-indexes";


buildIndexes(env.MEDIA_ROOT, indexationStatus);

export async function get() {
	const buildStarted = indexationStatus.getItem('buildStarted');
	const buildFinished = indexationStatus.getItem('buildFinished');
	const buildTime = buildFinished
		? buildFinished - buildStarted
		: Date.now() - buildStarted;

	let status = 'pending';
	if (buildFinished) {
		status = 'finished';
	} else if (buildStarted) {
		status = 'started';
	}

	return {
		body: {
			rootDir: indexationStatus.getItem('rootDir'),
			status,
			buildStarted,
			buildFinished,
			buildTime,
			queueSize: indexationStatus.getItem('queueSize'),
			indexAge: buildFinished ? Date.now() - buildFinished : 0,
			indexedFiles: indexationStatus.getItem('indexedFiles'),
		},
	};
}
