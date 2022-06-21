import { writable } from "svelte/store";

import inmemoryStorage from "$storages/in-memory";
import sessionStorage from "$storages/session";


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

function getPersistantStorage() {
	return typeof window !== 'undefined' ? sessionStorage : inmemoryStorage;
}

export function createPersistantStore(key, defaultValue) {
	const storage = getPersistantStorage();

	return createProxyStore({
		setItem: (value) =>  storage.setItem(key, value),
		getItem: () => storage.getItem(key, defaultValue),
		defaultValue,
	});
}
