<script context="module" lang="ts">
	import FileDrop from "filedrop-svelte";
	import type { Files, FileDropSelectEvent } from "filedrop-svelte";

	import { uploadFilesWithProgress } from '$utils/file-utils/upload-files';
</script>

<script lang="ts">
	let files: Files;
	let filesData: string[];
	let uploadResult: any;

	function acceptFiles(e: CustomEvent<FileDropSelectEvent>) {
		files = e.detail.files;
		if (!files.accepted.length) return;

		uploadFilesWithProgress(files.accepted, {
			chunkSize: 4,
			onChunkUpload: (chunkUploadResult: any) => {
				uploadResult = chunkUploadResult;
			}
		}).then(chunksUploadResults => {
			uploadResult = chunksUploadResults;
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
