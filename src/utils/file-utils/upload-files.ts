export function uploadFiles(files: File[]) {
	const data = new FormData();

	for (const [index, file] of Object.entries(files)) {
		data.append(`file-${index}`, file, file.name);
	}

	return fetch('/files/upload', {
		method: 'POST',
		body: data,
	});
}
