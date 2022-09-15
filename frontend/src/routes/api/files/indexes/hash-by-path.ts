import { hashByPath } from "$storages/indexes/hash-by-path";

export async function get() {
	return {
		body: hashByPath.toObject(),
	};
}
