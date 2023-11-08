<script>
	import { cubicInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { fadeScale } from '../utils/transitions';

	export let data;

	let width = 600;
	let height = 800;
	let hubSize = 250;
	let spokeLength = 200;
	let spokeSize = 200;
	let defaultAngle = 60; // Default angle between spokes

	let hub = {
		x: width / 2,
		y: height / 2,
		image: data.image,
		hasImage: data.image.length > 0
	};

	// Calculate the start angle for the first spoke to center them vertically
	let startAngle = Math.PI / 2 - ((data.parents.length - 1) * defaultAngle * (Math.PI / 180)) / 2;

	let spokes = data.parents.map((parent, i) => {
		// Adjust the angle for each spoke based on the number of parents
		let angle = startAngle + i * ((defaultAngle * Math.PI) / 180);
		return {
			x: hub.x + spokeLength * Math.cos(angle),
			y: hub.y - spokeLength * Math.sin(angle), // Minus because SVG y-coordinates go down
			image: parent.image,
			hasImage: parent.image.length > 0
		};
	});

	const CircleStyle = 'clip-path: circle(30% at 50% 40%);'; // Style to make the image a circle using clip-path
</script>

<svg {width} {height}>
	<!-- Spokes and Nodes -->
	{#each spokes as spoke}
		<line x1={hub.x} y1={hub.y} x2={spoke.x} y2={spoke.y} stroke="black" />
		{#if spoke.hasImage}
			<image
				transition:fade
				xlink:href={spoke.image}
				x={spoke.x - spokeSize / 2}
				y={spoke.y - spokeSize / 2}
				width={spokeSize}
				height={spokeSize}
				style={CircleStyle}
			/>
		{:else}
			<circle cx={spoke.x} cy={spoke.y} r={spokeSize / 3} fill="lightblue" />
		{/if}
	{/each}

	<!-- Hub -->
	{#if hub.hasImage}
		<image
			xlink:href={hub.image}
			x={hub.x - hubSize / 2}
			y={hub.y - hubSize / 2}
			width={hubSize}
			height={hubSize}
			style={CircleStyle}
		/>
	{:else}
		<circle cx={hub.x} cy={hub.y} r={hubSize / 2} fill="lightblue" />
	{/if}
</svg>

<style>
</style>
