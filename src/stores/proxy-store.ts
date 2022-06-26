import { writable } from "svelte/store";

import inmemoryStorage from "$storages/in-memory";
import browserStorage from "$storages/browser-storage";


 function createProxyStore({ setItem, getItem, defaultValue }) {
	let localValue = getItem(defaultValue);

	const { subscribe: subscribeLocal, set: setLocal } = writable(localValue);
	const set = (value) => {
		setItem(value)
		setLocal(value);
	};

	const get = (value) => {
		return localValue;
	};

	const subscribe = (...args) => {
		console.log('sub', args, localValue)
		return subscribeLocal(...args);
	}

	return {
		set,
		get,
		subscribe,
	};
}

function getPersistantStorage(sessionId) {
	return typeof window !== 'undefined' ? browserStorage : {
		setItem: (key, value) => inmemoryStorage.setItem(`${sessionId}:${key}`),
		getItem: (key, value) => inmemoryStorage.getItem(`${sessionId}:${key}`),
	};
}

export function createPersistantStore(sessionId, key, defaultValue) {
	const storage = getPersistantStorage(sessionId);

	const getItem = () => storage.getItem(key, defaultValue) ;
	const setItem = (value) => storage.setItem(key, value);

	return createProxyStore({ getItem, setItem, defaultValue });
}
