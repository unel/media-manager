
export function createInmemoryStorage(name = '') {
	const MEM = {};

	return {
		name,
		getItem(key, defaultValue) {
			if (!MEM.hasOwnProperty(key)) {
				MEM[key] = defaultValue;
			}

			return MEM[key];
		},

		setItem(key, value) {
			MEM[key] = value;
		},

		removeItem(key) {
			delete MEM[key];
		},

		updateItem(key, updater) {
			this.setItem(key, updater(this.getItem(key)));
		},

		toObject() {
			return MEM;
		},
	};
}

export default createInmemoryStorage('global');
