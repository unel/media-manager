import { resolve as resolvePath } from 'path';

import env from '$constants/env';
import { jsonFileStorage } from '$storages/json-file-storage';
import { createInmemoryStorage } from '$storages/in-memory';


function createStoreP() {
	const store =  jsonFileStorage(
		resolvePath(env.INDEXES_ROOT, 'hash-by-path.json')
	);

	return {
		loadData: () => store.loadData(),
		add: ({ hash, path }) => {
			return store.updateValue((data = {}) => ({
				...data,
				[path]: hash,
			}));
		},
		getItem: (hash)  => (store.getValue() || {})[hash],

		toObject: () => store.toObject(),
	}
}

function createStoreM() {
	const store = createInmemoryStorage();

	return {
		loadData: () => Promise.resolve(),
		add: ({ hash, path }) => store.setItem(path, hash),
		getItem: (hash) => store.getItem(hash),
		toObject: () => store.toObject(),
	}
}

const storeToFile = false;
export const hashByPath = storeToFile ? createStoreP() : createStoreM();
