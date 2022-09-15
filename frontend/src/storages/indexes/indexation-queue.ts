import { resolve as resolvePath } from 'path';
import env from '$constants/env';

import { jsonFileStorage } from '$storages/json-file-storage';
import { createInmemoryStorage } from '$storages/in-memory';

function createStoreP() {
	return jsonFileStorage(resolvePath(env.INDEXES_ROOT, 'indexation-queue.json'));
}

function createStoreM() {
	const store = createInmemoryStorage();

	return {
		loadData: () => Promise.resolve(),
		setValue: (value) => store.setItem('value', value),
		getValue: (value) => store.getItem('value'),
		updateValue: (updater) => store.updateItem('value', updater),
	};
}

export const indexationQueue = createStoreM();
