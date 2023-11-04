<script>
    import { enhance } from '$app/forms';

    export let form;
    
</script>

<form method="POST" action="/" use:enhance>
	<input name="name" placeholder="Enter name" type="text" required/>
	<button type="submit">Submit</button>
</form>


{#if form}
  <h1>is {form.data.name} a nepo? {form.data.nepo}!</h1>
  <!-- <p>hasWiki: {form.data.hasWiki}</p>
  <p>link: {form.data.link}</p> -->
  {#if form.data.hasImage}
    <img src={form.data.image} target="_blank">
  {/if}

  {#if form.data.nepo}
  <p>See {form.data.name}'s {form.data.nepoRelationshipType}
    {#if form.data.parents.length > 1}
       s
    {/if}:
  {#each form.data.parents as parent}
        <p>{parent.name}</p>
        <!-- <p>{parent.link}</p> -->
        <img src={parent.image} target="_blank">
  {/each}
</p>
{/if}
{/if}
