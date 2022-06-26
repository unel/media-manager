<style>
	:global(*),
	:global(*::before),
	:global(*::after) {
			box-sizing: border-box;
	}

	:global(*) {
		margin: 0;
	}

	:global(html),
	:global(body),
	:global(body > div:first-of-type),
	:global(main) {
		height: 100%;
		margin: 0;
		padding: 0;
	}

	:global(ul, li) {
		margin: 0;
		padding: 0;
	}
</style>

<slot />
