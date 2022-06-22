import { pathsByHash } from "$storages/indexes";

export async function get() {
	return {
		body: pathsByHash.toObject(),
	};
}
