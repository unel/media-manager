function getSessionStorage() {
	const storageKey = 'localStorage';
	const store = typeof window !== 'undefined' ? window[storageKey] : {};

	const setItem = (key, value) => {
		const strValue = JSON.stringify(value);
		store.setItem(key, strValue);
		fetch(`/memstore/${key}`, {
			method: 'POST',
			body: strValue,
			headers: {
				"content-type": "application/json"
			}
		});
	};

	const getItem = (key, defaultValue) => {
		if (!store.hasOwnProperty(key)) {
			setItem(key, defaultValue);
		}

		try {
			return JSON.parse(store.getItem(key));
		} catch (e) {
			return defaultValue;
		}
	};

	return { setItem, getItem };
}


export default getSessionStorage();
