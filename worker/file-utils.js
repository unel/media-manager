const  fs = require('fs/promises');
const path = require('path');

function makeRecursiveDirIterator(dirPath) {
	console.log('makeRecursiveDirIterator', dirPath)
	let availableData;

	return async function nextDir() {
		if (!availableData) {
			console.log('no availableData');
			availableData = await getDirItems(dirPath);
		}

		while (1) {
			const item = availableData.shift();
			if (!item) {
				return null;
			}

			if (item.isFile) {
				return { fileName: item.name, filePath: item.path };
			}

			const subItems = await getDirItems(item.path);
			availableData = availableData.concat(subItems);
		}

		if (awailableData.length === 0) {
			return null;
		}
	}
}

async function getDirItems(dirPath) {
	console.log('getDirItems', JSON.stringify(dirPath));
	const dirItems = await fs.readdir(dirPath, { withFileTypes: true });

	return dirItems.map(dirItem => ({
		name: dirItem.name,
		path: path.resolve(dirPath, dirItem.name),
		isFile: dirItem.isFile(),
		isDirectory: dirItem.isDirectory(),
	}));
}

module.exports = {
	makeRecursiveDirIterator,
	getDirItems,
};
