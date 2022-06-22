import inMemory from "$storages/in-memory";


export async function post({ params, request }) {
	const { key } = params;
	const value = await request.json();

	inMemory.setItem(key, value);

	return {
		body: 'ok'
	};
}

export async function get({ params }) {
	const { key } = params;

	return {
		body: inMemory.getItem(key),
	};
}
