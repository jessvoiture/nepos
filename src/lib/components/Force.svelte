<script>
	import { forceSimulation } from 'd3-force';

	// an array of our particles
	export let dots = [];
	// an array of [name, force] pairs
	export let forces = [];

	let usedForceNames = [];
	let renderedDots = [];

	let width = 1200;
	$: height = width;

	$: simulation = forceSimulation()
		.nodes(dots)
		.on('tick', () => {
			// update the renderedDots reference to trigger an update
			renderedDots = [...dots];
		});

	$: {
		// re-initialize forces when they change
		forces.forEach(([name, force]) => {
			simulation.force(name, force);
		});

		// remove old forces
		const newForceNames = forces.map(([name]) => name);
		let oldForceNames = usedForceNames.filter((force) => !newForceNames.includes(force));
		oldForceNames.forEach((name) => {
			simulation.force(name, null);
		});
		usedForceNames = newForceNames;

		// kick our simulation into high gear
		simulation.alpha(1);
		simulation.restart();
	}
</script>

<figure class="c" bind:clientWidth={width}>
	<svg {width} {height}>
		{#each renderedDots as { x, y, parents }, i}
			<circle r={6} />
			{#each parents as parent}
				<line x1={x} y1={y} x2={parent.x} y2={parent.y} style="stroke: #ccc; stroke-width: 1px;" />
			{/each}
		{/each}
	</svg>
</figure>
