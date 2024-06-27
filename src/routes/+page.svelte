<script>
	import { enhance } from '$app/forms';
	import InputForce from '../lib/components/InputForce.svelte';
	import ForceWrapper from '../lib/components/ForceWrapper.svelte';

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

		console.log(form.data);
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
	<InputForce data={form.data} />
	<!-- <ForceWrapper data={form.data} /> -->
{/if}
