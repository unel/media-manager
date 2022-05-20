import path from 'path';

import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					'$src': path.resolve('./src'),
					'$constants': path.resolve('./src/constants'),
					'$utils': path.resolve('./src/utils'),
				}
			}
		}
	}
};

export default config;
