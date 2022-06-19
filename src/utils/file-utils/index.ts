import { extname, resolve } from 'path';
import { stat, open, readFile, writeFile } from 'fs/promises';

import env from '$constants/env';


type TReadingMethods = 'readAsText' | 'readAsDataURL' | 'readAsBinaryString' | 'readAsArrayBuffer';
export async function readFileContent(file: File, method: TReadingMethods = 'readAsText'): Promise<string | ArrayBuffer | null> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);

		reader[method](file);
	});
}

export async function readFileAsDataURL(file: File): Promise<string> {
	const result = await readFileContent(file, 'readAsDataURL');
	if (typeof result !== 'string') {
		return '';
	}

	return result;
}

const kilobyte = 1024;
const megabyte = 1024 * kilobyte;

export function walkFileChunks(file: File, chunkSize: number = (2 * megabyte), cb: (error: Error | null, data: ArrayBuffer | null) => void) {
	const blobSlice = File.prototype.slice;
	const chunksAmount = Math.ceil(file.size / chunkSize);
	const fileReader = new FileReader();

	let currentChunk = 0;

	fileReader.onload = (e) => {
		cb(null, e.target?.result);
		currentChunk++;

		if (currentChunk < chunksAmount) {
			loadNext();
		} else {
			cb(null, null);
			return;
		}
	};

	fileReader.onerror = function (e) {
		cb(new Error(e.message), null);
	};

	const loadNext = () => {
		const start = currentChunk * chunkSize;
		const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

		fileReader.readAsBinaryString(blobSlice.call(file, start, end));
	};

	loadNext();
}


function byte2hexstr(byte: number) {
	return byte.toString(16).padStart(2, '0');
}

export async function computeFileHash(file: File | string, type: string = 'sha-1') {
	const algorithm = type.toUpperCase();
	const buffer = typeof file === 'string'
		? await readFile(file)
		: await file.arrayBuffer();

	const digest = await crypto.subtle.digest(algorithm, buffer);

	return Array.from(new Uint8Array(digest))
		.map(
			(byte: number) => byte2hexstr(byte)
		)
		.join('');
}

export async function generateBaseMetainfoForFile(file: File): Promise<Object> {
	const sha1 = await computeFileHash(file, 'sha-1');

	return {
		"file-name": file.name,
		"hashes": {
			"sha-1": sha1,
		},
		"tags": [],
	};
}

export async function getMetaPath(file: File | string) {
	const hash = await computeFileHash(file, 'sha-1');

	return resolve(env.INFO_ROOT, `${hash}.json`);
}

export async function getUploadPath(file: File) {
	const hash = await computeFileHash(file, 'sha-1');
	const ext = extname(file.name);

	return resolve(env.UPLOAD_ROOT, `${hash}${ext}`);
}

export async function updateMetaForFile(file: File, meta: Object) {
	const metaPath = await getMetaPath(file);
	const prevInfo = await getFileMeta(file);
	const nextInfo = {
		...prevInfo,
		...meta,
		"tags": Array.from(new Set([...(prevInfo.tags || []), ...(meta.tags || [])])),
		"update-meta-datetime": Date.now(),
	};

	writeFile(metaPath, JSON.stringify(nextInfo, undefined, 4));

	return nextInfo;
}

export async function getFileMeta(file: File | string): Promise<Object> {
	const metaPath = await getMetaPath(file);
	const isMetaFileExists = await isFileExists(metaPath);

	return isMetaFileExists ? JSON.parse(await readFile(metaPath)) : await generateBaseMetainfoForFile(file);
}

export async function isFileExists(path: string): Promise<boolean> {
	try {
		const fileStat = await stat(path);
		return true;

	} catch {
		return false;
	}
}
