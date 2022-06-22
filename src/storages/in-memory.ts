
export function createInmemoryStorage() {
	const MEM = {};

	return {
		getItem(key, defaultValue) {
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

export default createInmemoryStorage();
