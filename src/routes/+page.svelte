<script>
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import LookUp from '../lib/components/LookUp.svelte';
	import Grid from '../lib/components/Grid.svelte';

	// export let form;
	export let data;

	let screenWidth;
	let screenHeight;

	let nepos = data.nepos;

	function resize() {
		screenWidth = window.innerWidth;
		screenHeight = window.innerHeight;
	}

	if (browser) {
		resize();
	}

	console.log(data);
</script>

<svelte:window on:resize={resize} />

<Grid data={nepos} {screenHeight} {screenWidth} />
