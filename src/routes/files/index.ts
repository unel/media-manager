import { resolve } from 'path';
import { readdir } from 'fs/promises';

const FILES_PATH = '/run/media/unl/UNL.STORE/eighteen+';


async function walkFiles(dir: string, cb: (filePath: string) => void, parent) {
	const items = await readdir(dir, { withFileTypes: true });

	for (const item of items) {
		const itemPath = resolve(dir, item.name);
		if (item.isDirectory()) {
			await walkFiles(itemPath, cb, item);
		} else {
			cb(itemPath);
		}
	}

	if (!parent) {
		cb(null);
	}
}

async function getFilesList(dir: string): string[] {
	// IMPROVEME: revrite to generators (but not async!)
	const list = [];

	return new Promise(resolve => {
		walkFiles(dir, filePath => {
			if (filePath === null) {
				return resolve(list);
			}

			list.push(filePath);
		});
	});
}

export async function get() {
	// IMPROVEME: FIX SECUTITY ISSUE: access to any folder by path
	// IMPROVEME: what if we get a lot of files here? :-/
	const files = await getFilesList(FILES_PATH);

	return {
		body: files,
	};
}
