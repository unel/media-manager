
function createInmemoryStorage() {
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
		}
	};
}

export default createInmemoryStorage();
