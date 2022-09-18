const fs = require('fs/promises');
const path = require('path');
const fastify = require('fastify');
const mongoose = require('mongoose');
require('dotenv').config();

const fileUtils = require('./file-utils');

const server = fastify({ logger: true });
const GLOBAL_ENV = { ...process.env };
const ENV = {
	UPLOAD_DIR: GLOBAL_ENV.MW_UPLOAD_DIR,
	PROCESSING_DIR: GLOBAL_ENV.MW_PROCESSING_DIR,
}

function configServer() {
	server.get('/', async (request, response) => {
		return {
			ok: 'ok'
		};
	});
}

const SHEMAS = {};
const MODELS = {};

async function configMongo() {
	SHEMAS.TASK = new mongoose.Schema({
		type: String,
		path: String,
	});

	MODELS.TASK = mongoose.model('Task', SHEMAS.TASK);
}

async function start() {
	configServer();
	await configMongo();

	await Promise.all([
		startMongo(),
		startServer(),
	]);


	// await MODELS.TASK.deleteMany({
	// 	type: /.*/,
	// });

	console.log('\n\nworker started');
	console.log(JSON.stringify(ENV, undefined, 2));

	workLoop();
}

async function startServer() {
	const port = 8888;
	const host = '192.168.0.101';
	try {
		await server.listen({ port, host });
	} catch (e) {
		console.log('error httpserver start', e);
	}
}

async function startMongo() {
	const mongoHost = 'localhost';
	const mongoPort = 27017;
	const mongoUrl = `mongodb://${mongoHost}:${mongoPort}/mm`;

	try {
		await mongoose.connect(mongoUrl);
		console.log('mongo connected');
	} catch (e) {
		console.error('error connecting to mongo', e);
	}
}

const TIME_BETWEEN_LOOPS = 30_000;
const MINIMAL_TIME_BETWEEN_LOOPS = 1_000;

async function workLoop() {
	const startTime = Date.now();
	await doWork({ startTime, availableTime: TIME_BETWEEN_LOOPS });
	const processingTime = Date.now() - startTime;

	console.log('task processed by ', processingTime / 1000, ' seconds');

	const restTime = Math.max(MINIMAL_TIME_BETWEEN_LOOPS, TIME_BETWEEN_LOOPS - processingTime);
	console.log('rest ', restTime / 1000, ' seconds');
	setTimeout(workLoop, restTime);
}

async function doWork({ startTime, availableTime }) {
	console.log('process tasks...');

	const steps = [
		scanUploadFiles,
		processTasks,
	];

	for (const step of steps) {
		const canContinue = await executeFn(async () => {
			await step({ startTime, availableTime });
		}, { startTime, availableTime });

		if (!canContinue) {
			return;
		}
	}
}

async function executeFn(fn, { startTime, availableTime }) {
	await fn();

	return (availableTime - (Date.now() - startTime)) > 1000;
};

async function executeSteps() {

}

async function scanUploadFiles({ startTime, availableTime }) {
	const nextPath = fileUtils.makeRecursiveDirIterator(ENV.UPLOAD_DIR);

	while (1) {
		const { fileName, filePath } = await nextPath();
		const processingPath = path.resolve(ENV.PROCESSING_DIR, fileName);
		await fs.rename(filePath, processingPath);
		const canContinue = await executeFn(async () => {
			const taskData = {
				type: 'first-process',
				path: processingPath,
			};

			const existTask = await MODELS.TASK.findOne(taskData).exec();
			if (!existTask) {
				console.log('put file into preprocessing task', filePath);
				const task = new MODELS.TASK(taskData);
				await task.save();
			} else {
				console.log('skip task');
			}
		}, { startTime, availableTime });

		if (!canContinue) {
			console.log('can not continue')
			return;
		}
	}
}

async function processTasks() {

}

start();
