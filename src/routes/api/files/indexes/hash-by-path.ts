import { hashByPath } from "$storages/indexes";

export async function get() {
	return {
		body: hashByPath.toObject(),
	};
}
