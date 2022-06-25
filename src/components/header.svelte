<script lang="ts">
	import { page } from '$app/stores';

	const pages = [
		{url: '/', title: 'index', name: 'index'},
		{url: '/indexes', title: 'indexation status', name: 'indexation'},
	];

	$: currentPage = pages.find(pageItem => pageItem.name == $page.stuff.pageName);
	$: currentPageName = currentPage?.name;
</script>

<style>
.link {
}

.link-current {
	color: black;
	font-weight: bold;
	text-decoration: none;
}
</style>


<header>
	<h1>{currentPage?.title}</h1>

	<nav>
		<ul>
			{#each pages as pageItem }
				<li><a class={pageItem.name == currentPageName ? 'link-current' : 'link'} href={pageItem.url}>{pageItem.title}</a></li>
			{/each}
		</ul>
	</nav>
</header>

