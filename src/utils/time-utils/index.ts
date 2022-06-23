export async function delay<T = void>(timeout: number, result: T = undefined): Promise<T> {
	return new Promise<T>(resolve => {
		setTimeout(() => {
			resolve(result);
		}, timeout);
	});
}
