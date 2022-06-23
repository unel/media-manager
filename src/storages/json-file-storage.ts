// /* storage where every key is file */

import { readFile, writeFile } from 'fs/promises';

import { walkDirItems } from "$utils/file-utils/walk-dir-Items";

export function jsonFileStorage(path: string) {
	let MEM;

	async function loadData() {
		try {
			const content = await readFile(path, 'utf-8');
			const parsedContent = JSON.parse(content);

			MEM = parsedContent;
		} catch {};
	}

	async function saveData() {
		content = JSON.stringify(MEM, undefined, 4);
		return writeFile(path, content, 'utf-8');
	}

	async function setValue(value) {
		MEM = value;
		return saveData();
	}

	function getValue() {
		return MEM;
	}

	async function updateValue(updater: (oldValue) => any) {
		return setValue(updater(getValue()));
	}


	return {
		loadData,
		saveData,
		setValue,
		getValue,
		updateValue,
		toObject: () => MEM,
	};
}
