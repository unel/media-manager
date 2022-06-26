<script context="module" lang="ts">
	import type { LoadEvent } from '@sveltejs/kit';
	export async function load({ fetch, session }: LoadEvent) {
		const response = await fetch(`/api/files`);
		const data = await response.json();

		return {
			props: {
				data,
				session,
			},

			stuff: {
				pageName: 'index',
			},
		};
	}
</script>

<script lang="ts">
	type TFileData = {
		path: string,
		meta: Object,
	}
	import { pickRandomElement, pickRandomElements } from '$utils/array-utils';
	import { createPersistantStore } from '$src/stores/proxy-store';
	import Media from '$components/media.svelte';
	import IndexationStatus from '$src/components/indexation-status.svelte';
	export let data: TFileData[];
	export let session: Record<string, any>;

	let seed = Math.random();
	const pathRe = createPersistantStore(session.sessionId, 'settings.pathRe', '.jpg$');
	const previewSize = createPersistantStore(session.sessionId, 'settings.ps', 27);
	const dataLimit = createPersistantStore(session.sessionId, 'settings.dataLimit', 10);

	$: types = [...new Set(data.map((d: TFileData) => getFileExtension(d.path)))];
	$: filteredData = filter(data, $dataLimit, $pathRe, seed);

	let selectedFile: TFileData | undefined;

	function getFileExtension(path: string): string {
		return path.slice(((path.lastIndexOf('.') - 1) >>> 0) + 2);
	}

	function selectFile(newSelectedFile: TFileData) {
		selectedFile = newSelectedFile;
	}

	function clearFile() {
		// selectedFile = undefined;
	}

	function filter(data: TFileData[], dataLimit: number, pathRe: string, seed: number): TFileData[] {
		const re = new RegExp(pathRe || '.*');
		const filterFn = (data: TFileData) => data.path && re.test(data.path);

		return pickRandomElements(data.filter(filterFn), dataLimit);
	}

	function applyPathFilter(e: any) {
		pathRe.set(e.target.value);
	}

	function changeShuffleSeed() {
		seed = Math.random();
	}
</script>

<svelte:head>
	<title>hello dude/index</title>
</svelte:head>

<section class="content">
	<!-- <section class="viewbox" class:viewbox--m-visible={selectedFile}>
		{#if selectedFile}
			<a href="/files/{encodeURIComponent(selectedFile.path)}">
				<Media path={selectedFile.path} height="100%" />
			</a>
		{/if}
	</section> -->

	<section class="grid">
		<section class="indexation">
			<IndexationStatus />
		</section>

		<section class="filter">
			<input name="re" type="text" bind:value={$pathRe} />
			<input name="limit" type="number" bind:value={$dataLimit} min="0" max={data.length} />
			<select on:change={applyPathFilter}>
				<option value=".*">any</option>
				{#each types as fileType}
					<option value="\.{fileType}$">{fileType}</option>
				{/each}
			</select>
			<button on:click={changeShuffleSeed}>shuffle</button>

			<hr />
			<input type="range" min={10} max={100} bind:value={$previewSize} />
		</section>

		{#if filteredData?.length}
			<section class="media-list">
				<div class="list list--m-vertical">
				{#each filteredData as fileData}
					<!-- <span
						on:mouseenter={(e) => {
							// selectFile(fileData);
						}}
						on:mouseleave={clearFile}
					> -->
						{#if fileData?.path}
							<Media path={fileData.path} />
						{/if}
					<!-- </span> -->
				{/each}
				</div>
			</section>
		{/if}
	</section>
</section>

<style>
	.content {
		display: flex;
		flex-direction: column;
		height: 100%;
		max-height: 100%;
	}

	.grid {
		display: grid;
  		grid-auto-columns: 1fr;
		grid-template-columns: 0.8fr 1fr;
  		grid-template-rows: calc(16 * var(--step-size)) 1fr;
		gap: calc(2 * var(--step-size));
		grid-template-areas:
			"indexation filter"
			"media-list media-list";
	}


	.viewbox {
		/* grid-area: preview; */
		opacity: 0;
		/* transition: opacity 1s linear; */
		/* box-shadow: 5px 5px 5px -5px rgba(34, 60, 80, 0.6); */
		overflow: hidden;
	}

	.viewbox--m-visible {
		opacity: 0.99;
	}

	.indexation {
		grid-area: indexation;
		border: 1px solid silver;
		padding: calc(2 * var(--step-size));
	}

	.filter {
		grid-area: filter;
		display: inline-block;
		border: 1px solid silver;
		padding: calc(2 * var(--step-size));
	}

	.media-list {
		grid-area: media-list;
		border: 1px solid  silver;
		padding: calc(2 * var(--step-size));
	}

	.list {
		height: 100%;
		max-height: 100%;
		display: flex;
		/* overflow: auto; */
		gap: var(--step-size);
		align-items: stretch;
	}

	.list--m-horizontal {
		flex-direction: row;
		/* flex-wrap: wrap; */
	}

	.list--m-vertical {
		flex-direction: column;
	}
</style>
