import { extname, resolve } from 'path';
import { stat, open, readFile, writeFile, readdir } from 'fs/promises';

import env from '$constants/env';
import {  hashByPath, pathsByHash, metaByHash } from '$storages/indexes';
import { delay } from '$utils/time-utils';
import { computeFileHash } from './compute-file-hash';


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

export async function getMetaFileName(file: File | string): Promise<string> {
	const hash = await computeFileHash(file, 'sha-1');
	return `${hash}.json`;
}

export async function getNormalisedFileName(file: File | string): Promise<string> {
	const hash = await computeFileHash(file, 'sha-1');
	const ext = extname(file.name);

	return `${hash}${ext}`;
}

export async function getMetaPath(file: File | string): Promise<string> {
	return resolve(env.INFO_ROOT, await getMetaFileName(file));
}

export async function getUploadPath(file: File | string): Promise<string> {
	return resolve(env.UPLOAD_ROOT, await getNormalisedFileName(file));
}

export async function getStorePath(file: File | string): Promise<string> {
	return resolve(env.STORE_ROOT, await getNormalisedFileName(file));
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

type ArrayElementType<ArrayType extends Array> = ArrayType[number];

type TReaddirResult = ReturnType<typeof readdir>;
type TWalkItems = Awaited<TReaddirResult>;
type TWalkItem =ArrayElementType<TWalkItems>;
type TWalkEntry = {
	path: string,
	items: TWalkItems,
}

type TWalkItemResult = {
	path: string,
	item: TWalkItem,
};

type TWalkItemsCb = (item: TWalkItemResult | null, next: () => void) => void;

async function getWalkEntry(path: string): Promise<WalkEntry> {
	const items = await readdir(path, { withFileTypes: true });

	return { path, items };
}

async function walkItemsByEntries(walkEntries: TWalkEntry[] , cb: TWalkItemsCb) {
	// console.log('walkItemsByEntries/step', walkEntries.length);
	if (walkEntries.length === 0) {
		// console.log('walkItemsByEntries/entires is empty, call final cb');
		return cb(null);
	}

	const entry = walkEntries[0];
	// console.log('walkItemsByEntries/entry', entry);
	if (entry.items.length === 0) {
		// console.log('walkItemsByEntries/shifting enties');
		walkEntries.shift();
		return walkItemsByEntries(walkEntries, cb);
	}

	const item = entry.items.shift();
	const itemPath = resolve(entry.path, item.name);
	// console.log('walkItemsByEntries/entry item', itemPath, item);

	if (item?.isDirectory()) {
		// console.log('walkItemsByEntries/get subentries of ', itemPath);
		subEntry = await getWalkEntry(itemPath);
		walkEntries.push(subEntry);
		return walkItemsByEntries(walkEntries, cb);
	}

	// console.log('walkItemsByEntries/call cb for', itemPath, item);
	cb({ path: itemPath, item },
		() => { walkItemsByEntries(walkEntries, cb) }
	);
}

export async function walkDirItems(dir: string, cb: TWalkItemsCb): void {
	const rootEntry = await getWalkEntry(dir);
	walkItemsByEntries([rootEntry], cb);
}

export async function buildFilesIndexes(rootDir, statusStorage) {
	if (statusStorage.getItem('buildStarted') && !statusStorage.getItem('buildFinished')) {
		console.warn('wowowo, it is dangerous!!');
		return;
	}

	statusStorage.setItem('rootDir', rootDir);
	statusStorage.setItem('buildStarted', Date.now());
	statusStorage.setItem('buildFinished', undefined);
	statusStorage.setItem('indexedFiles', 0);


	walkDirItems(rootDir,  async (data, next) => {
		// console.log('walkDirItem', data, 'start');

		if (data === null) {
			statusStorage.setItem('buildFinished', Date.now());
			return;
		}

		const path = data.path;
		const hash = await computeFileHash(path);

		pathsByHash.updateItem(hash, (paths = []) => paths.concat([path]));
		hashByPath.setItem(path, hash);

		const meta = await getFileMeta(path);
		metaByHash.setItem(hash, meta);

		statusStorage.updateItem('indexedFiles', (count = 0) => count + 1);
		// console.log('walkDirItem', data, 'finish');

		await delay(20);
		next();
	});
}
