import inMemory from "$storages/in-memory";



export async function post({ params, request, locals }) {
	const key = `${locals.sessionId}:${params.key}`;
	const value = await request.json();

	inMemory.setItem(key, value);

	return {
		body: {
			message: `param ${key} set to ${value}`
		},
	};
}

export async function get({ params, locals }) {
	const key = `${locals.sessionId}:${params.key}`;

	return {
		body: inMemory.getItem(key),
	};
}
