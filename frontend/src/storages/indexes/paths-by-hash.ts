import { resolve as resolvePath } from 'path';

import env from '$constants/env';
import { jsonFileStorage } from '$storages/json-file-storage';
import { createInmemoryStorage} from '$storages/in-memory';


function createStoreP() {
	const store = jsonFileStorage(resolvePath(env.INDEXES_ROOT, 'paths-by-hash.json'));

	return {
		loadData: () => store.loadData(),
		add: ({ hash, path }) => {
			return store.updateValue((data = {}) => ({
				...data,
				[hash]:  (data[hash] || []).concat([path])
			}));
		},
		toObject: () => store.toObject(),
	}
}

function createStoreM() {
	const store = createInmemoryStorage();

	return {
		loadData: () => Promise.resolve(),
		add: ({ hash, path }) => {
			return store.updateItem(hash, (paths = []) => (paths.concat([path])));
		},
		toObject: () => store.toObject(),
	}
}


const storeToFile = false;
export const pathsByHash = storeToFile ? createStoreP() : createStoreM();
