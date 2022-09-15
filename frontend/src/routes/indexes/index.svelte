<script context="module" lang="ts">
	import type { LoadEvent } from '@sveltejs/kit';
	type TTimestamp = number;
	type TMSDuration = number;

	type TIndexationStatus = {
		rootDir: string;
		status: 'pending' | 'started' | 'finidhed';
		buildStarted?: TTimestamp;
		buildFinished?: TTimestamp;
		buildTime: TMSDuration;
		indexAge: TMSDuration;
		indexedFiles: number;
		queueSize: number;
	}
	async function fetchStatus(): Promise<TIndexationStatus> {
		const response = await fetch('/api/files/indexes');
		const data = await response.json();

		return data;
	}

	async function rebuildIndexes() {
		fetch('/api/files/indexes/rebuild', { method: 'POST' });
	}

	export async function load({ fetch }: LoadEvent) {
		let data, error;

		try {
			data = await fetchStatus();
		} catch (e) {
			error = String(e);
		}

		return {
			props: {
				data,
				error,
			},

			stuff: {
				pageName: 'indexation',
			},
		};
	}
</script>

<script lang="ts">
	export let data: TIndexationStatus;
	export let error: string;

	let prevStatus: TIndexationStatus = data;
	let status: TIndexationStatus = data;

	$: speed = status ?  Math.round(status.indexedFiles / (status.buildTime / 1000)) : 0;
	$: totalTime = status ? Math.round(status.queueSize / speed ) : 0;
	$: timeDelta = (prevStatus && status) ? status.buildTime - prevStatus.buildTime : 0;
	$: filesDelta = (prevStatus && status) ? status.indexedFiles - prevStatus.indexedFiles : 0;
	$: deltaSpeed = (timeDelta && filesDelta) ? Math.round(filesDelta / (timeDelta / 1000)) : 0;
	$: estimationByDelta = deltaSpeed ?  Math.round(status.queueSize / deltaSpeed) : 0;

	setInterval(async () => {
		try {
			const newStatus = await fetchStatus();

			prevStatus = status;
			status = newStatus;
		} catch (e) {
			error = String(e);
		}
	}, 3000);

</script>

<svelte:head>
	<title>indexation status</title>
</svelte:head>

<section>
	{#if status}
		<pre>{JSON.stringify(status, undefined, 4)}</pre>
		last delta time: {timeDelta} <br>
		last delta files: {filesDelta} <br>
		speed: -avg: {speed} files / sec, -delta: {deltaSpeed} files / sec<br>
		time to finish: - avg: {totalTime} sec, -delta: {estimationByDelta} sec
	{:else if error}
		fetch status error: {error}
	{/if}

	<button on:click={() => rebuildIndexes()}>
		rebuild
	</button>

</section>
