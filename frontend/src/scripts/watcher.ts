import { resolve } from 'path';
import chokidar from 'chokidar';

import { computeFileHash } from "$utils/file-utils/compute-file-hash";
import env from '$constants/env';

function main() {
	console.log('started with env', env);
	const path = resolve(env.UPLOAD_ROOT);
	const watcher = chokidar.watch(path, {
		ignoreInitial: false,
	});

	watcher.on('add', (path) => {
		processFile(path);
	})
}

async function  processFile(path: string) {
	const hash = await computeFileHash(path);
	console.log('new file added', path, hash);
}

main();
