import inMemory from "$storages/in-memory";

export async function get() {
	return {
		body: {
			store: {
				name: inMemory.name,
				data: inMemory.toObject(),
			}
		}
	};
}
