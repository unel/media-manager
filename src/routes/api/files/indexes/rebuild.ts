import env from '$constants/env';
import { indexationStatus } from '$storages/indexes';
import { buildFilesIndexes } from '$utils/file-utils';

export async function post() {
	console.log('index rebuild');
	if (indexationStatus.getItem('status') === 'started') {
		console.log('rebuild skip');
		return {
			body: 'already in progress'
		};
	}

	console.log('rebuild start');
	buildFilesIndexes(env.MEDIA_ROOT, indexationStatus);
	return {
		body: 'started',
	};
}
