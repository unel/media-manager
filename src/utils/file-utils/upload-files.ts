import { splitToChunks } from "$utils/array-utils";

export function uploadFiles(files: File[]) {
	const data = new FormData();

	for (const [index, file] of Object.entries(files)) {
		data.append(`file-${index}`, file, file.name);
	}

	return fetch('/api/files/upload', {
		method: 'POST',
		body: data,
	});
}


export function uploadFilesWithProgress(files: File[], { chunkSize = 4, onChunkUpload }) {
	const filesQueue = splitToChunks(files, chunkSize);
	const totalChunks = filesQueue.length;
	let currentChunkIndex = 0;


	return new Promise(async (resolve) => {
		const results = [];

		while (filesQueue.length) {
			const files = filesQueue.shift();
			if (!files?.length) {
				break;
			}

			const uploadRespone = await uploadFiles(files);
			const uploadJson = await uploadRespone.json();
			const chunkUploadResult = {
				chunkIndex: currentChunkIndex,
				totalChunks,
				chunkSize: files.length,
				uploadResult: uploadJson,
			};

			onChunkUpload?.(chunkUploadResult);

			results.push(chunkUploadResult);
			currentChunkIndex += 1;
		}

		resolve(results);
	});
}
