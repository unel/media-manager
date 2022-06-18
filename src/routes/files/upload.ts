import { resolve, extname } from 'path';
import { stat, writeFile } from 'fs/promises';

import env from '$constants/env';
import { computeFileHash } from '$utils/file-utils';

async function writeDataByPathIfNotExists(data: any, path: string): Promise<boolean> {
	try {
		const fileStat = await stat(path);
		// don't rewrite already exists files
		console.log('writing data', data, ' to ', path, ' // already exists');
		return false;

	} catch (e) {
		// file not found => can write
		// IMPROVEME: check error
		await writeFile(path, data);
		console.log('writing data', data, ' to ', path, ' // written');
		return true
	}
}
async function writeFileByPathIfNotExist(file: File, path: string): Promise<boolean> {
	return writeDataByPathIfNotExists(file.stream(), path);
}

async function writeFileToUploads(file: File) {
	const hash = await computeFileHash(file, 'sha-1');
	const mediaFilePath = resolve(env.UPLOAD_ROOT, `${hash}${extname(file.name)}`);
	const metaFilePath = resolve(env.INFO_ROOT, `${hash}.yaml`);

	writeFileByPathIfNotExist(file, mediaFilePath);
	writeDataByPathIfNotExists(`
	    -file-name: ${file.name}
	    -hashes:
	        -sha-1: ${hash}
	`, metaFilePath);
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
