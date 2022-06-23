import { pathsByHash } from "$storages/indexes/paths-by-hash";

export async function get() {
	return {
		body: pathsByHash.toObject(),
	};
}
