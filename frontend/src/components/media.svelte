<script lang="ts">
	export let path: string = '';
	export let width: string = '';
	export let height: string = '';

	function getFileExtension(path: string = ''): string {
		return path.slice(((path.lastIndexOf('.') - 1) >>> 0) + 2);
	}

	function getFileName(path: string = ''): string {
		return path.split('\\').pop()?.split('/')?.pop() ?? '';
	}

	const videoExtensions = new Set(['mp4', 'webm']);
	const imageExtensions = new Set(['jpg', 'jpeg', 'gif', 'png', 'webp']);

	$:url = `/media/${encodeURIComponent(getFileName(path))}`;
	$: extension = getFileExtension(path).toLocaleLowerCase();
	$: isVideo = videoExtensions.has(extension);
	$: isImage = imageExtensions.has(extension);

	$:style = width
		? `width: ${width}`
		 : height
		 	? `height: ${height}`
			 : '';

	$:mediaStyle = width
		? 'width: 100%'
		: 'height: 100%';

</script>

<style>
	.root {
		display: inline-block;
	}
	.media {
		object-fit: contain;
		max-height: 100%;
		max-width: 100%;
	}
</style>

<!-- <div style={style} class="root"> -->
	{#if isVideo}
		<video  class="media" style={style} controls loop>
			<source src={url} type="video/{extension}">
		</video>
	{:else if isImage}
		<img src="{url}" class="media" style={style} />
	{:else}
		<a href="{url}">{url}</a>
	{/if}
<!-- </div> -->

