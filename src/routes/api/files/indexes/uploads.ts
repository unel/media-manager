import { uploadsMetaIndex } from '$storages/indexes/meta-index';
import { uploadsIndexationStatus } from "$storages/indexes/indexation-status";

export async function get() {
	return {
		body: {
			status: uploadsIndexationStatus.toObject(),
			index: uploadsMetaIndex.toObject(),
		}
	};
}
