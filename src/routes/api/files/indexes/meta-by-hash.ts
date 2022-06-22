import { metaByHash } from "$storages/indexes";

export async function get() {
	return {
		body: metaByHash.toObject(),
	};
}
