import { resolve } from 'path';
import { readdir } from 'fs/promises';

import env from '$constants/env';
import { getFileMeta, walkFiles } from '$utils/file-utils';
import { computeFileHash } from '$utils/file-utils/compute-file-hash';
import { hashByPath } from "$storages/indexes/hash-by-path";
import { metaByHash } from "$storages/indexes/meta-by-hash";

async function getFilesList(dir: string): string[] {
	const paths = [];
	const metaPromises = [];

	return Object.entries(hashByPath.toObject() || {}).map(([path, hash]) => {
		return {
			path,
			meta: metaByHash.getItem(hash),
		};
	});
}

export async function get() {
	// IMPROVEME: FIX SECUTITY ISSUE: access to any folder by path
	// IMPROVEME: what if we get a lot of files here? :-/
	const files = await getFilesList(env.MEDIA_ROOT);

	return {
		body: files,
	};
}
