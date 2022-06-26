import { uploadsMetaIndex } from '$storages/indexes/meta-index';
import { uploadsIndexationStatus, uploadsProcessingStatus } from "$storages/indexes/indexation-status";


export async function get() {
	return {
		body: {
			uploads: {
				status: uploadsIndexationStatus.toObject(),
			},

			processing: {
				status: uploadsProcessingStatus.toObject(),
			}
		}
	};
}
