import { resolve, extname } from 'path';
import { stat, writeFile } from 'fs/promises';

import { getUploadPath, updateMetaForFile } from '$utils/file-utils';
import { buildUploadsIndex } from '$utils/file-utils/build-meta-index';
import { processUploadsIndex } from "$utils/file-utils/process-uploads-index";


async function writeFileToUploads(file: File) {
	const uploadPath = await getUploadPath(file);

	const writePromise = writeFile(uploadPath, file.stream());
	const metaPromise = updateMetaForFile(file, {
		"upload-datetime": Date.now(),
	});

	const [writeResult, meta] = await Promise.all([writePromise, metaPromise]);

	return {writeResult, meta};
}

export async function post({ request }) {
	const formData = await  request.formData();
	const results = [];

	for (const [key, file] of formData.entries()) {
		const result = await writeFileToUploads(file);
		results.push({
			key,
			fileName: file.name,
			result,
		});
	}

	buildUploadsIndex().then(() => {
		processUploadsIndex();
	})

	return {
		status: 200,
		body: results,
	};
}
