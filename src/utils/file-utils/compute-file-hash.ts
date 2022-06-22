import { readFile } from 'fs/promises';

export function byte2hexstr(byte: number) {
	return byte.toString(16).padStart(2, '0');
}

const CACHE = new Map();
export async function computeFileHash(file: File | string, type: string = 'sha-1') {
	const cacheKey = file;
	if (CACHE.has(cacheKey)) {
		console.log('cache ok', cacheKey);
		return CACHE.get(cacheKey);
	}
	console.log('cache miss', cacheKey);

	const algorithm = type.toUpperCase();
	const buffer = typeof file === 'string'
		? await readFile(file)
		: await file.arrayBuffer();

	const digest = await crypto.subtle.digest(algorithm, buffer);

	const hash = Array.from(new Uint8Array(digest))
		.map(
			(byte: number) => byte2hexstr(byte)
		)
		.join('');

	CACHE.set(cacheKey, hash);

	return hash;
}
