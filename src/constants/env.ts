import 'dotenv/config';

const metaEnv = import.meta.env || process.env;

const env = {
	UPLOAD_ROOT: metaEnv.VITE_UPLOAD_ROOT,
	MEDIA_ROOT: metaEnv.VITE_MEDIA_ROOT,
	META_ROOT: metaEnv.VITE_META_ROOT,
	INDEXES_ROOT: metaEnv.VITE_INDEXES_ROOT,
	STORE_ROOT: metaEnv.VITE_STORE_ROOT,
};


export default env;
