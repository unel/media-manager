import env from '$constants/env';
import { indexationStatus } from "$storages/indexes/indexation-status";
import { buildIndexes } from "$utils/file-utils/build-indexes";

export async function post() {
	console.log('index rebuild');
	if (indexationStatus.getItem('status') === 'started') {
		console.log('rebuild skip');
		return {
			body: 'already in progress'
		};
	}

	console.log('rebuild start');
	buildIndexes(env.MEDIA_ROOT, indexationStatus);
	return {
		body: 'started',
	};
}
