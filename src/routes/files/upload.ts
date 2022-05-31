import { resolve } from 'path';
import { stat, writeFile } from 'fs/promises';

import env from '$constants/env';


async function writeFileToUploads(file: File) {
	const path = resolve(env.UPLOAD_ROOT, file.name);

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
