import { resolve as resolvePath } from 'path';

import env from '$constants/env';
import { jsonFilesStorage } from '$storages/json-files-storage';
import { createInmemoryStorage} from '$storages/in-memory';


export function metaIndex(name = 'meta index') {
	const metaByHash = createInmemoryStorage();
	const hashByPath = createInmemoryStorage();

	return {
		name,
		loadData: () => Promise.resolve(),

		add: ({ path, hash, meta }) => {
			metaByHash.setItem(hash, meta);
			hashByPath.setItem(path, hash);
		},

		remove: ({ path, hash, meta }) => {
			metaByHash.removeItem(hash);
			hashByPath.removeItem(path);
		},

		getItem: (hashOrPath) => {
			const valueByHash = metaByHash.getItem(hashOrPath);

			if (valueByHash) {
				return valueByHash;
			}

			return metaByHash.getItem(hashByPath(hashOrPath));
		},

		getEntries: () => {
			 return Object.entries(hashByPath.toObject()).map(([path, hash]) => ({
				path,
				hash,
				meta: metaByHash.getItem(hash),
			 }));
		},

		toObject: () => metaByHash.toObject(),
	}
}

export const uploadsMetaIndex = metaIndex('uploads meta index');
