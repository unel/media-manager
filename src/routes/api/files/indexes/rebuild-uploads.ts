import { buildUploadsIndex } from '/utils/file-utils/build-meta-index';

export async function post() {
	buildUploadsIndex();

	return {
		body: {
			message: 'ok'
		},
	};
}
