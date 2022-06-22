import { resolve } from 'path';
import chokidar from 'chokidar';

import env from '$constants/env';

function main() {
	console.log('started with env', env);
	const path = resolve(env.UPLOAD_ROOT);
	const watcher = chokidar.watch(path, {
		ignoreInitial: true,
	});

	watcher.on('add', (path) => {
		console.log('new file added', path);
	})
}


main();
