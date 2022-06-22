import 'dotenv/config';

const metaEnv = import.meta.env || process.env;

const env = {
	UPLOAD_ROOT: metaEnv.VITE_UPLOAD_ROOT,
	MEDIA_ROOT: metaEnv.VITE_MEDIA_ROOT,
	INFO_ROOT: metaEnv.VITE_INFO_ROOT,
	STORE_ROOT: metaEnv.VITE_STORE_ROOT,
};


export default env;
