import { resolve as resolvePath } from 'path';

import env from '$constants/env';
import { jsonFilesStorage } from '$storages/json-files-storage';
import { createInmemoryStorage} from '$storages/in-memory';
import { storage } from '$storages/mongo-storage';

function createStoreP() {
	const store =  jsonFilesStorage(resolvePath(env.INDEXES_ROOT, 'meta'), '.meta.json');

	return {
		loadData: () => store.loadData(),
		add: ({ hash, meta }) => {
			store.setItem(hash, meta);
		},
		getItem: (hash) => store.getItem(hash),
		toObject: () => store.toObject(),
	}
}

function createStoreM() {
	const store = createInmemoryStorage();

	return {
		loadData: () => Promise.resolve(),
		add: ({ hash, meta }) => store.setItem(hash, meta),
		getItem: (hash) => store.getItem(hash),
		toObject: () => store.toObject(),
	}
}

const storeToFile = false;
export const metaByHash = storeToFile ? createStoreP() : createStoreM();
