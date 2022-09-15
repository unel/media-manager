function getBrowserStorage() {
	const prefix = 'browser-storage:';
	const storageKey = 'localStorage';
	const store = typeof window !== 'undefined' ? window[storageKey] : {};
	const makeStoreKey = key => `${prefix}${key}`;

	const sync = (key, value) => {
		fetch(`/api/memstore/${key}`, {
			method: 'POST',
			body: value,
		});
	};

	for (const [key, value] of Object.entries(store)) {
		if (key.startsWith(prefix)) {
			const keyWithoutPrefix = key.substring(prefix.length);
			console.log('sync ', {key, keyWithoutPrefix, value});
			sync(keyWithoutPrefix, value);
		}
	}

	const setItem = (key, value) => {
		const strValue = JSON.stringify(value);
		store.setItem(makeStoreKey(key), strValue);
		sync(key, strValue);
	};

	const getItem = (key, defaultValue) => {
		const storeKey = makeStoreKey(key);
		if (!store.hasOwnProperty(storeKey)) {
			console.log('store has no prop', )
			setItem(key, defaultValue);
		}

		try {
			return JSON.parse(store.getItem(storeKey));
		} catch (e) {
			return defaultValue;
		}
	};

	return { setItem, getItem };
}


export default getBrowserStorage();
