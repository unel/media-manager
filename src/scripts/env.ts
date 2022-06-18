import 'dotenv/config';

const env = {
	UPLOAD_ROOT: process.env.VITE_UPLOAD_ROOT,
	MEDIA_ROOT: process.env.VITE_MEDIA_ROOT,
	INFO_ROOT: process.env.VITE_INFO_ROOT,
};

export default env;
