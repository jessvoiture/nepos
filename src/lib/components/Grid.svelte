<script>
	import { hoveredDatapoint, mouseX, mouseY } from '../stores';
	import Tooltip from './Tooltip.svelte';

	export let data;
	export let screenHeight;
	export let screenWidth;

	let svgHeight;
	let svgWidth;
	let height;
	let width;
	let totalPaddingWidth;
	let totalPaddingHeight;
	let rectSize;
	let rectHeight;

	// Number of items
	const itemCount = data.length;
	const minRectPadding = 4;
	const padding = 15;

	// dimensions
	$: {
		if (screenWidth < screenHeight) {
			svgHeight = screenHeight * 0.8;
			svgWidth = screenWidth * 0.8;
		} else {
			svgHeight = screenHeight * 0.8;
			svgWidth = screenWidth * 0.6;
		}

		width = svgWidth - 2 * padding;
		height = svgHeight - 2 * padding;
	}

	// Calculate the number of columns
	$: columns = Math.ceil(Math.sqrt((itemCount * width) / height));
	$: rows = Math.ceil(itemCount / columns);

	// Calculate the rectangle size to fill the SVG
	$: {
		totalPaddingWidth = (columns - 1) * minRectPadding;
		totalPaddingHeight = (rows - 1) * minRectPadding;
		rectSize = (width - totalPaddingWidth) / columns;
		rectHeight = (height - totalPaddingHeight) / rows;
	}

	// Adjust the rectangle size considering the padding
	$: adjustedRectSize = Math.min(rectSize, rectHeight);
	$: rectPaddingX = (width - adjustedRectSize * columns) / (columns - 1);
	$: rectPaddingY = (height - adjustedRectSize * rows) / (rows - 1);

	const handleMouseover = function (event, d) {
		hoveredDatapoint.set(d);
		mouseX.set(event.clientX);
		mouseY.set(event.clientY);
	};

	const handleMouseout = function () {
		hoveredDatapoint.set(undefined);
	};
</script>

<svg width={svgWidth} height={svgHeight}>
	<g transform={`translate(${padding}, ${padding})`}>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		{#each data as d, i}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<rect
				x={(i % columns) * (adjustedRectSize + rectPaddingX)}
				y={Math.floor(i / columns) * (adjustedRectSize + rectPaddingY)}
				width={adjustedRectSize}
				height={adjustedRectSize}
				fill="blue"
				stroke={$hoveredDatapoint && $hoveredDatapoint.id === d.id ? 'red' : 'none'}
				on:mouseover={function (event) {
					handleMouseover(event, d);
				}}
				on:mouseout={function () {
					handleMouseout();
				}}
			/>
		{/each}
	</g>
</svg>

{#if $hoveredDatapoint != undefined}
	<Tooltip {screenWidth} {screenHeight} />
{/if}

<style>
</style>
