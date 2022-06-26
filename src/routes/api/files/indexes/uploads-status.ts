import { uploadsIndexationStatus } from "$storages/indexes/indexation-status";

export async function get() {
	return {
		body: uploadsIndexationStatus.toObject(),
	};
}
