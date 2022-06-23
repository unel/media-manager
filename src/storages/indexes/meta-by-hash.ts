import { resolve as resolvePath } from 'path';

import env from '$constants/env';
import { jsonFilesStorage } from '$storages/json-files-storage';

function createStore() {
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
export const metaByHash = createStore();
