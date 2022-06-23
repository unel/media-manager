import { resolve as resolvePath } from 'path';

import env from '$constants/env';
import { jsonFileStorage } from '$storages/json-file-storage';


function createStore() {
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

export const hashByPath = createStore();
