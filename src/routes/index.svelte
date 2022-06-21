<script context="module" lang="ts">
	export async function load({ fetch }: any) {
		const response = await fetch(`/files`);
		const data = await response.json();

		return {
			props: {
				data
			}
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
	import Media from '../components/media.svelte';
	export let data: TFileData[];

	let seed = Math.random();
	const pathRe = createPersistantStore('settings.pathRe', '.jpg$');
	const previewSize = createPersistantStore('settings.ps', 27);
	const dataLimit = createPersistantStore('settings.dataLimit', 10);

	$: types = [...new Set(data.map((d: TFileData) => getFileExtension(d.path)))];
	$: filteredData = filter(data, $dataLimit, $pathRe, seed);

	let selectedFile: TFileData | undefined = pickRandomElement(data);

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
		const filterFn = (data: TFileData) => re.test(data.path);

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
	<title>hello dude</title>
</svelte:head>
<main>
	<section class="grid" style="grid-template-columns: {$previewSize}% {100 - $previewSize}%;">
		<section class="filter">
			<h1>total files: {data.length}</h1>
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

		<section class="viewbox {selectedFile ? 'viewbox-visible' : ''}">
			{#if selectedFile}
				<a href="/files/{encodeURIComponent(selectedFile.path)}">
					<Media path={selectedFile.path} height="100%" />
				</a>
			{/if}
		</section>

		{#if data}
			<section class="media-list">
				{#each filteredData as fileData}
					<span
						on:mouseenter={(e) => {
							selectFile(fileData);
						}}
						on:mouseleave={clearFile}
					>
						<Media path={fileData.path} width="100%" />
					</span>
				{/each}
			</section>
		{/if}
	</section>
</main>

<style>
	:global(html),
	:global(body),
	:global(body > div),
	:global(main) {
		height: 100%;
		/* max-height: 100%; */
		margin: 0;
		padding: 0;
	}
	.grid {
		height: 100%;
		max-height: 100%;
		display: grid;
		grid-auto-columns: 1fr;
		grid-template-columns: 50% 50%;
		grid-template-rows: min-content 1fr;
		gap: 16px 0;
		grid-template-areas:
			"filter filter"
			"list preview";
			}

	.viewbox {
		grid-area: preview;
		/* opacity: 0; */
		/* transition: opacity 1s linear; */
		/* box-shadow: 5px 5px 5px -5px rgba(34, 60, 80, 0.6); */
		overflow: hidden;
	}

	.viewbox-visible {
		/* opacity: 0.99; */
	}

	.filter {
		grid-area: filter;
		box-shadow: 5px 5px 5px -5px rgba(34, 60, 80, 0.6);
		padding: 20px;
	}

	.media-list {
		grid-area: list;
		box-sizing: border-box;
		padding: 16px;
		height: 100%;
		overflow-y: auto;
	}
</style>
