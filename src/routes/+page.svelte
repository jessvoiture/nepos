<script>
	import { browser } from '$app/environment';
	import Grid from '../lib/components/Grid.svelte';

	// export let form;
	export let data;

	let screenWidth;
	let screenHeight;

	// let nepos = data.nepos;
	let nepodata = data.data;

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

<Grid data={nepodata} {screenHeight} {screenWidth} />
