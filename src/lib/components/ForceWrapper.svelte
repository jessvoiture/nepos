<script>
	import { forceLink } from 'd3-force';
	import Force from './Force.svelte';

	export let data = {};

	// Extracting relevant information from the data object
	const { name, parents } = data;

	// Ensure that 'parents' is an array
	const parentDots = Array.isArray(parents)
		? parents.map((parent) => ({
				x: Math.random() * 800,
				y: Math.random() * 600,
				parent
		  }))
		: [];

	// Random position for the main dot (name)
	const mainDot = { x: Math.random() * 800, y: Math.random() * 600, name };

	// Combining the main dot and parent dots into a single dots array
	const dots = [mainDot, ...parentDots];

	// Creating links between the main dot and its parent dots
	const forces = [['link', forceLink(dots)]];

	console.log('DOTS', dots);
</script>

<Force {dots} {forces} />

<style>
	/* Add any custom styling here */
</style>
