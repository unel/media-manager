type TReadingMethods = 'readAsText' | 'readAsDataURL' | 'readAsBinaryString' | 'readAsArrayBuffer';
export async function readFile(file: File, method: TReadingMethods = 'readAsText'): Promise<string | ArrayBuffer | null> {
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

const kilobyte = 1024;
const megabyte = 1024 * kilobyte;

export function walkFileChunks(file: File, chunkSize: number = (2 * megabyte), cb: (error: Error | null, data: ArrayBuffer | null) => void) {
	const blobSlice = File.prototype.slice;
	const chunksAmount = Math.ceil(file.size / chunkSize);
	const fileReader = new FileReader();

	let currentChunk = 0;

	fileReader.onload = (e) => {
		cb(null, e.target?.result);
		currentChunk++;

		if (currentChunk < chunksAmount) {
			loadNext();
		} else {
			cb(null, null);
			return;
		}
	};

	fileReader.onerror = function (e) {
		cb(new Error(e.message), null);
	};

	const loadNext = () => {
		const start = currentChunk * chunkSize;
		const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

		fileReader.readAsBinaryString(blobSlice.call(file, start, end));
	};

	loadNext();
}


function byte2hexstr(byte: number) {
	return byte.toString(16).padStart(2, '0');
}

export async function computeFileHash(file: File, type: string = 'sha-1') {
	const algorithm = type.toUpperCase();
	const buffer = await file.arrayBuffer();
	const digest = await crypto.subtle.digest(algorithm, buffer);

	return Array.from(new Uint8Array(digest))
		.map(
			(byte: number) => byte2hexstr(byte)
		)
		.join('');
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
