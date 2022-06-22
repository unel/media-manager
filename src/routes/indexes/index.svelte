<script context="module" lang="ts">
	async function fetchStatus() {
		try {
			const response = await fetch('/api/files/indexes');
			const data = await response.json();

			return data;
		} catch (e) {
			// console.warn('e??', e);
		}
	}

	async function rebuildIndexes() {
		fetch('/api/files/indexes/rebuild', { method: 'POST' });
	}

	export async function load({ fetch }: any) {
		return {
			props: {
				data: await fetchStatus(),
			}
		};
	}
</script>

<script lang="ts">
	export let data = {};

	let status = data;

	// setInterval(async () => {
	// 	// status = await fetchStatus();
	// }, 1000);

</script>

<svelte:head>
	<title>indexation status</title>
</svelte:head>

<main>
	<section>
		<pre>{JSON.stringify(status, undefined, 4)}</pre>
		<button on:click={() => rebuildIndexes()}>
			rebuild
	</button>
	</section>
</main>

<style>
	:global(html),
	:global(body),
	:global(body > div),
	:global(main) {
		height: 100%;
		margin: 0;
		padding: 0;
	}
</style>
