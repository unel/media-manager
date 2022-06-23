import { resolve as resolvePath } from 'path';

import env from '$constants/env';
import { jsonFileStorage } from '$storages/json-file-storage';


function createStore() {
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

export const pathsByHash = createStore();
