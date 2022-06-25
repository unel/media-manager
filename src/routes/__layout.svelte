<script context="module" lang="ts">
	export async function load( ) {
		return {
			stuff: {
			},
		};
	}
</script>


<script lang="ts">
	import Header from '$components/header.svelte';
</script>

<svelte:head>
	<title>hello, dude</title>
</svelte:head>

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

	.root {
		padding: 0 36px;
	}
</style>

<main class="root">
	<Header />

	<slot/>
</main>
