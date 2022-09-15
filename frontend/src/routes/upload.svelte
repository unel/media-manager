<main>
	<div class="upload-zone">
		<FileDrop on:filedrop={acceptFiles}>
			<button>click to upload</button>
			{#if files}
			{#each files.accepted as file}
				<li>{file.name} - {file.size}</li>
			{/each}
			{/if}

			{#if filesData}
			{#each filesData as fileDataURL }
				<img src={fileDataURL}  class="image-preview" />
			{/each}
			{/if}

			{#if uploadResult}
				<pre>{JSON.stringify(uploadResult, undefined, 4)}</pre>
			{/if}
		</FileDrop>
	</div>
</main>

<script lang="ts">
	import FileDrop from "filedrop-svelte";
	import type { FileDropSelectEvent } from "filedrop-svelte";
	import type { Files } from "filedrop-svelte";

	import { uploadFiles } from '$utils/file-utils/upload-files';

	let files: Files;
	let filesData: string[];
	let uploadResult: any;

	function acceptFiles(e: CustomEvent<FileDropSelectEvent>) {
		files = e.detail.files;
		if (!files.accepted.length) return;

		uploadFiles(files.accepted)
			.then(response => response.json())
			.then(result => {
				uploadResult = result;
			});

		// Promise.all<string>(
		// 	files.accepted.map(
		// 		file => readFileAsDataURL(file)
		// 	)
		// ).then(dataUrls => {
		// 	filesData = dataUrls;
		// })
	}
</script>

<style>
	main {
		display:  flex;
		justify-content: center;
	}

	.upload-zone {
		border: 1px dashed silver;
		padding: 16px;
		min-height: 50vh;
		width: 80vw;
	}

	.image-preview {
		width: 30%;
	}
</style>
