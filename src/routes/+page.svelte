<script>
	import { enhance } from '$app/forms';

	export let form;
	let inputName;

	$: if (form) {
		inputName = form.data.name;
	}
</script>

<form method="POST" action="/" use:enhance>
	<input name="name" placeholder="Enter name" type="text" required />
	<button type="submit">Submit</button>
</form>

{#if form}
	<h1>
		is <a href={form.data.link} target="_blank">{inputName}</a> a nepo? {form.data.nepo}!
	</h1>

	<!-- <p>{form.data.infobox}</p> -->
	{#if form.data.image.length > 0}
		<div class="img-wrapper subj">
			<img
				src={form.data.image}
				target="_blank"
				alt="image of {form.data.name}"
				class="circle-crop"
			/>
		</div>
	{/if}

	{#if form.data.nepo}
		<p>
			See {form.data.name}'s {form.data.nepoRelationshipType}
			{#if form.data.parents.length > 1}s
			{/if}:
			{#each form.data.parents as parent}
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
		border: 8px solid black;
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
