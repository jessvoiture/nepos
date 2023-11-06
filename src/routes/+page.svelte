<script>
	import { enhance } from '$app/forms';

	export let form;

	let inputName;
	let image;
	let hasWiki;
	let link;
	let hasImage;
	let nepo;
	let nepoRelationshipType;
	let parents;
	let isLoading = false;
	let showingContent = false;

	$: if (form) {
		inputName = form.data.name;
		image = form.data.image;
		hasWiki = form.data.hasWiki;
		link = form.data.link;
		hasImage = form.data.hasImage;
		nepo = form.data.nepo;
		nepoRelationshipType = form.data.nepoRelationshipType;
		parents = form.data.parents;
	}

	$: if (form && form.data) {
		// Form data is available, so stop loading and show the content.
		isLoading = false;
		showingContent = true;
	}

	$: console.log('isLoading', isLoading);
	$: console.log('displayingContent', showingContent);
</script>

<form
	method="POST"
	action="/"
	use:enhance={() => {
		isLoading = true;
		showingContent = false;
		return async ({ update }) => {
			update();
		};
	}}
>
	<input name="name" placeholder="Enter name" type="text" required />
	<button type="submit">Submit</button>
</form>

{#if isLoading}
	<p>Loading</p>
{/if}

{#if showingContent}
	<h1>
		is

		{#if hasWiki}
			<a href={link} target="_blank">{inputName}</a>
		{:else}
			{inputName}
		{/if} a nepo?

		{nepo}!
	</h1>

	{#if image.length > 0}
		<div class="img-wrapper subj">
			<img src={image} target="_blank" alt="image of {name}" class="circle-crop" />
		</div>
	{/if}

	{#if nepo}
		<p>
			See {inputName}'s {nepoRelationshipType}
			{#if parents.length > 1}s
			{/if}:
			{#each parents as parent}
				<p><a href={parent.link} target="_blank">{parent.name}</a></p>
				<!-- <p>{parent.link}</p> -->
				{#if parent.image.length > 0}
					<div class="img-wrapper parent">
						<img
							src={parent.image}
							target="_blank"
							alt="image of {parent.name}"
							class="circle-crop"
						/>
					</div>
				{/if}
			{/each}
		</p>
	{/if}
{/if}

<style>
	.img-wrapper {
		width: 200px;
		height: 200px;
		position: relative;
		border: 4px solid black;
		-webkit-border-radius: 1000px;
		-moz-border-radius: 1000px;
		border-radius: 1000px;
		overflow: hidden;
	}
	.circle-crop {
		display: block;
		margin: 0 auto;
		height: auto;
		width: 100%;
	}
</style>
