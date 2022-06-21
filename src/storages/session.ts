function getSessionStorage() {
	const setItem = (key, value) => {
		const strValue = JSON.stringify(value);
		window.sessionStorage.setItem(key, strValue);
		fetch(`/memstore/${key}`, {
			method: 'POST',
			body: strValue,
			headers: {
				"content-type": "application/json"
			}
		});
	};

	const getItem = (key, defaultValue) => {
		if (!window.sessionStorage.hasOwnProperty(key)) {
			setItem(key, defaultValue);
		}

		try {
			return JSON.parse(window.sessionStorage.getItem(key));
		} catch (e) {
			return defaultValue;
		}
	};

	return { setItem, getItem };
}


export default getSessionStorage();
