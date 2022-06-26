<script context="module" lang="ts">
	import FileDrop from "filedrop-svelte";
	import type { Files, FileDropSelectEvent } from "filedrop-svelte";

	import { uploadFiles } from '$utils/file-utils/upload-files';
</script>

<script lang="ts">
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
	}
</script>

<style>
	.upload-zone {
		background: lightgrey;
		padding: 16px;
		min-height: 32px;
	}

	.image-preview {
		width: 30%;
	}
</style>

<div class="root">
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
</div>
