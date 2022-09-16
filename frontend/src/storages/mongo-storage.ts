import mongoose from "mongoose";

const mongoHost = 'mm-mongo';
const mongoPort = 27017;
const mongoUrl = `mongodb://${mongoHost}:${mongoPort}`;

async function main() {
	console.log('trying to connect', mongoUrl);
	await mongoose.connect(mongoUrl);
}


main()
	.then(() => {
		console.log('connected to mongo', mongoUrl);
	})
	.catch((error) => {
		console.error('Error with initialization connection to mongo', mongoUrl, error);
	});


export const storage = {};
