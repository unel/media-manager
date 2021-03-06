import { readFile } from 'fs/promises';

import { hashByPath } from "$storages/indexes/hash-by-path";

export function byte2hexstr(byte: number) {
	return byte.toString(16).padStart(2, '0');
}

export async function computeFileHash(file: File | string, type: string = 'sha-1'): Promise<string> {
	const path = typeof file === 'string' ? file : undefined;

	const cachedValue = hashByPath.getItem(path);
	if (cachedValue) {
		return cachedValue;
	}

	const algorithm = type.toUpperCase();
	const buffer = typeof file === 'string'
		? await readFile(path)
		: await file.arrayBuffer();

	const digest = await crypto.subtle.digest(algorithm, buffer);

	const hash = Array.from(new Uint8Array(digest))
		.map(
			(byte: number) => byte2hexstr(byte)
		)
		.join('');

	if (path) {
		hashByPath.add({ path, hash });
	}

	return hash;
}
