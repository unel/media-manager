import { resolve } from 'path';
import { readFile } from 'fs/promises';

export async function get(request) {
	const {path} = request.params;
	// IMPROVEME: FIX SECUTITY ISSUE: access to any file by path
	const data = await readFile(path, { })

	return {
		body: data,
	};
}
