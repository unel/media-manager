<script context="module" lang="ts">
	type TTimestamp = number;
	type TMSDuration = number;

	type TIndexationStatus = {
		rootDir: string;
		status: 'pending' | 'started' | 'finished';
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
		await fetch('/api/files/indexes/rebuild', { method: 'POST' });
	}
</script>

<script lang="ts">
	let prevStatus: TIndexationStatus ;
	let status: TIndexationStatus ;

	$: speed = status ?  Math.round(status.indexedFiles / (status.buildTime / 1000)) : 0;
	$: totalTime = status ? Math.round(status.queueSize / speed ) : 0;
	$: timeDelta = (prevStatus && status) ? status.buildTime - prevStatus.buildTime : 0;
	$: filesDelta = (prevStatus && status) ? status.indexedFiles - prevStatus.indexedFiles : 0;
	$: deltaSpeed = (timeDelta && filesDelta) ? Math.round(filesDelta / (timeDelta / 1000)) : 0;
	$: estimationByDelta = deltaSpeed ?  Math.round(status.queueSize / deltaSpeed) : 0;

	async function updateStatus() {
		try {
			const newStatus = await fetchStatus();

			if (status && newStatus && newStatus.indexedFiles - status.indexedFiles == 0) {
				return;
			}

			prevStatus = status;
			status = newStatus;

			if (status.status == 'finished') {
				stopStatusUpdating();
			}
		} catch (e) {
		}
	}

	let timerId: any;
	function startStatusUpdating(interval = 3000) {
		timerId = setInterval(updateStatus, 3000);
	}

	function stopStatusUpdating() {
		clearInterval(timerId);
	}

	async function runRebuildIndexes() {
		await rebuildIndexes();
		await updateStatus();

		startStatusUpdating();
	}

	updateStatus().then(() => startStatusUpdating());
</script>

<section class="root">
	{#if status}
		Indexation {status.status}. {status.indexedFiles} files indexed.
		{#if status.queueSize}{status.queueSize} items in queue.{/if}

		{#if status.status == 'finished'}
			<hr />
			<button on:click={runRebuildIndexes}>
				reindex
			</button>
		{:else}
			<hr />
			Speed: -avg: {speed} files / sec, -delta: {deltaSpeed} files / sec.<br />
			Time to finish: - avg: {totalTime} sec, -delta: {estimationByDelta} sec.
		{/if}

	{:else}
		Loading information about indexation..
	{/if}
</section>

<style>
	.root {
		border: 1px solid silver;
		padding: 16px;
		display: inline-block;
	}
</style>
