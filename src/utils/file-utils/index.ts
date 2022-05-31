type TReadingMethods = 'readAsText' | 'readAsDataURL' | 'readAsBinaryString' | 'readAsArrayBuffer';
export async function readFile(file: File, method : TReadingMethods= 'readAsText'): Promise<string | ArrayBuffer | null> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);

		reader[method](file);
	});
}

export async function readFileAsDataURL(file: File): Promise<string> {
	const result = await readFile(file, 'readAsDataURL');
	if (typeof result !== 'string') {
		return '';
	}

	return result;
}


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
