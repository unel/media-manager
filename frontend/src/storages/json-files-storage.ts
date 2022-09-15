/* storage where every key is file */

import { extname, resolve, parse as parsePath } from 'path';
import { stat, open, readFile, writeFile, readdir } from 'fs/promises';

import { walkDirItems } from "$utils/file-utils/walk-dir-Items";


export function jsonFilesStorage(dir: string, suffix = '.json') {
	const MEM = {};

	function buildPath(key: string) {
		return resolve(dir, `${key}${suffix}`);
	}

	async function loadData() {
		return new Promise((resolve, reject) => {
			walkDirItems(dir, async (data, next) => {
				if (data === null) { return resolve() }

				try {
					const content = await readFile(data.path, 'utf-8');
					const parsedContent = JSON.parse(content);
					const { name: key } = parsePath(data.path);
					MEM[key] = parsedContent;
				} catch (e) {

				} finally {
					next();
				}
			})
		});
	}

	async function saveData() {
		for (key of Object.keys(MEM)) {
			await saveItem(key);
		}
	}

	async function loadItem(key) {
		try {
			const data = await readFile(buildPath(key), 'utf-8');
			const parsed = JSON.parse(data);
			MEM[key] = parsed;
		} catch {}
	}

	async function saveItem(key) {
		try {
			const data = JSON.stringify(MEM[key], undefined, 4);
			await writeFile(buildPath(key), data, 'utf-8');
		} catch {}
	}

	function setItem(key, value) {
		MEM[key] = value;
		saveItem(key);
	}

	function getItem(key, value) {
		return MEM[key];
	}

	function updateItem(key, updater: (oldValue) => any) {
		setItem(key, updater(getItem(key)));
	}

	return {
		loadData,
		saveData,
		setItem,
		getItem,
		updateItem,
		toObject: () => MEM,
	};
}
