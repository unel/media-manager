import { writable } from "svelte/store";

import inmemoryStorage from "$storages/in-memory";
import browserStorage from "$storages/browser-storage";


export function createProxyStore({ setItem, getItem, defaultValue }) {
	let localValue = getItem(defaultValue);

	const { subscribe, set: setLocal } = writable(localValue);
	const set = (value) => {
		setItem(value)
		setLocal(value);
	};

	return {
		set,
		get: () => localValue,
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

	const getItem = (value) => storage.getItem(key, defaultValue) ;
	const setItem = (value) => storage.setItem(key, value);

	return createProxyStore({ getItem, setItem, defaultValue });
}
