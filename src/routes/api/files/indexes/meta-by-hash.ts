import { metaByHash } from "$storages/indexes/meta-by-hash";

export async function get() {
	return {
		body: metaByHash.toObject(),
	};
}
