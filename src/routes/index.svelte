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
	import Media from '../components/media.svelte';
	export let data: string[];

	let dataLimit = 10;
	let pathRe = '.jpg$';
	let seed = Math.random();
	let previewSize = 27;

	$: types = [...new Set(data.map((f: string) => getFileExtension(f)))];
	$: filteredData = filter(data, dataLimit, pathRe, seed);

	let selectedFile: string | undefined = data[0];

	function getFileExtension(path: string): string {
		return path.slice(((path.lastIndexOf('.') - 1) >>> 0) + 2);
	}

	function selectFile(newSelectedFile: string) {
		selectedFile = newSelectedFile;
	}

	function clearFile() {
		// selectedFile = undefined;
	}

	function filter(data: string[], dataLimit: number, pathRe: string, seed: number): string[] {
		const re = new RegExp(pathRe || '.*');
		const copy = data.slice();
		if (seed) {
			shuffle(copy);
		}

		return copy.filter((f: string) => re.test(f)).slice(0, dataLimit);
	}

	function applyPathFilter(e: any) {
		pathRe = e.target.value;
	}

	function shuffle(array: any[]): void {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	function changeShuffleSeed() {
		seed = Math.random();
	}
</script>

<svelte:head>
	<title>hello dude</title>
</svelte:head>
<main>
	<section class="grid" style="grid-template-columns: {previewSize}% {100 - previewSize}%;">
		<section class="filter">
			<h1>total files: {data.length}</h1>
			<input name="re" type="text" bind:value={pathRe} />
			<input name="limit" type="number" bind:value={dataLimit} min="0" max={data.length} />
			<select on:change={applyPathFilter}>
				<option value=".*">any</option>
				{#each types as fileType}
					<option value="\.{fileType}$">{fileType}</option>
				{/each}
			</select>
			<button on:click={changeShuffleSeed}>shuffle</button>

			<hr />
			<input type="range" min={10} max={100} bind:value={previewSize} />
		</section>

		<section class="viewbox {selectedFile ? 'viewbox-visible' : ''}">
			{#if selectedFile}
				<a href="/files/{encodeURIComponent(selectedFile)}">
					<Media path={selectedFile} height="100%" />
				</a>
			{/if}
		</section>

		{#if data}
			<section class="media-list">
				{#each filteredData as file}
					<span
						on:mouseenter={(e) => {
							selectFile(file);
						}}
						on:mouseleave={clearFile}
					>
						<Media path={file} width="100%" />
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
