import { resolve, extname } from 'path';
import { stat, writeFile } from 'fs/promises';

import env from '$constants/env';
import { computeFileHash } from '$utils/file-utils';


async function writeFileToUploads(file: File) {
	const hash = await computeFileHash(file, 'sha-1');
	const path = resolve(env.UPLOAD_ROOT, `${hash}${extname(file.name)}`);

	console.log('file', file.name, 'path', path);

	try {
		const fileStat = await stat(path);
		// don't rewrite already exists files
		return 'skipped';

	} catch (e) {
		// file not found => can write
		// IMPROVEME: check error
		await writeFile(path, file.stream());
		return 'ok';
	}
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

	return {
		status: 200,
		body: results,
	};
}
