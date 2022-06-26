<script lang="ts">
	import { page } from '$app/stores';

	const pages = [
		{url: '/', title: 'index', name: 'index'},
		{url: '/indexes', title: 'indexation status', name: 'indexation'},
	];

	$: pageStuff = $page.stuff as Record<string, unknown>;
	$: currentPage = pages.find(pageItem => pageItem.name == pageStuff.pageName);
	$: currentPageName = currentPage?.name;
</script>

<style>
.link {
}

.link--m-active {
	color: black;
	font-weight: bold;
	text-decoration: none;
}

.links-list {
	display: flex;
	flex-direction: row;

	padding: 0;
	column-gap: 16px;
}

.links-list-item {
	display: inline-block;
}
</style>


<header>
	<h1>{currentPage?.title}</h1>

	<nav>
		<ul class="links-list">
			{#each pages as pageItem }
				<li class="links-list-item">
					<a
						class="link"
						class:link--m-active = {pageItem.name == currentPageName}

						href={pageItem.url}
					>
						[{ pageItem.title }]
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>

