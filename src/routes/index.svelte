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
	import { pickRandomElements } from '$utils/array-utils';
	import { createPersistantStore } from '$src/stores/proxy-store';
	import Media from '$components/media.svelte';
	import IndexationStatus from '$src/components/indexation-status.svelte';
	export let data: TFileData[];
	export let session: Record<string, any>;

	let seed = Math.random();
	const contentAwareProceed = createPersistantStore(session.sessionId, 'settings.contentAwareProceed', false);
	const pathRe = createPersistantStore(session.sessionId, 'settings.pathRe', '.jpg$');
	const dataLimit = createPersistantStore(session.sessionId, 'settings.dataLimit', 10);
	const displayFormat = createPersistantStore(session.sessionId, 'settings.displayFormat', 'column');

	$: types = [...new Set(data.map((d: TFileData) => getFileExtension(d.path)))];
	$: filteredData = filter(data, $dataLimit, $pathRe, seed);

	function getFileExtension(path: string): string {
		return path.slice(((path.lastIndexOf('.') - 1) >>> 0) + 2);
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

{#if $contentAwareProceed}
<section class="content">
	<section class="grid">
		<section class="indexation">
			<IndexationStatus />
		</section>

		<section class="filter">
			<input name="re" type="text" bind:value={$pathRe} />
			<input name="limit" type="number" bind:value={$dataLimit} min="1" max={data.length} />
			<select on:change={applyPathFilter} value={$pathRe}>
				<option value=".*">any</option>
				{#each types as fileType}
					<option value="\.{fileType}$">{fileType}</option>
				{/each}
			</select>
			<button on:click={changeShuffleSeed}>shuffle</button>

			<select bind:value={$displayFormat}>
				<option value="row">in a row</option>
				<option value="column">in a column</option>
			</select>
		</section>

		{#if filteredData?.length}
			<section class="media-list">
				<div
					class="list"
					class:list--m-horizontal={$displayFormat == 'row'}
					class:list--m-vertical={$displayFormat == 'column'}
				>
				{#each filteredData as fileData}
					{#if fileData?.path}
						<Media path={fileData.path} />
					{/if}
				{/each}
				</div>
			</section>
		{/if}
	</section>
</section>
{:else}
	Restricted area: 18+ content! <button on:click={() => $contentAwareProceed = true}>i'm okay with this</button>
{/if}

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
