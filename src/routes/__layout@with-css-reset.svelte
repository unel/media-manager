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
	:global(:root) {
		--step-size: 8px;
	}
	.root {
		--nav-bar-width: 0;
		--header-height: calc(16 * var(--step-size));

		padding: var(--step-size);
		display: grid;
		grid-auto-columns: 1fr;
		grid-template-columns: var(--nav-bar-width) 1fr;
		grid-template-rows: var(--header-height) 1fr;
		gap: 0 0;
		grid-template-areas:
			"header header"
			"navigation-menu content";
	}

	.header {
		grid-area: header;
	}

	.navigation-menu {
		grid-area: navigation-menu;
	}

	.layout-content {
		grid-area: content;
	}
</style>

<main class="root">
	<section class="header">
		<Header />
	</section>

	<section class="navigation-menu">

	</section>

	<section class="layout-content">
		<slot/>
	</section>
</main>
