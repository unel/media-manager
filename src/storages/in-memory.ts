
export function createInmemoryStorage(name = '') {
	const MEM = {};

	return {
		name,
		getItem(key, defaultValue) {
			if (name == 'global') {
				console.log(`inmem "${name}" getItem`, key, MEM[key], MEM);
			}

			if (!MEM.hasOwnProperty(key)) {
				MEM[key] = defaultValue;
			}

			return MEM[key];
		},

		setItem(key, value) {
			MEM[key] = value;
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
