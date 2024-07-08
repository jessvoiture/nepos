<script>
	import { scaleSequential } from 'd3-scale';
	import { extent } from 'd3-array';
	import { interpolateBlues } from 'd3-scale-chromatic';

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

	data.sort((a, b) => {
		return a.pct_nepo - b.pct_nepo;
	});

	// Number of items
	const itemCount = data.length;
	const minRectPadding = 4;
	const padding = 15;
	const fixedWidth = 20;
	const fixedHeight = (20 * 7) / 5;

	const nepoTitles = data.filter((d) => d.pct_nepo > 0);
	const pctNepoExtent = extent(nepoTitles, (d) => data.pct_nepo);

	// colour scale
	const colorScale = scaleSequential(interpolateBlues).domain(pctNepoExtent);

	// dimensions
	$: {
		if (screenWidth < screenHeight) {
			svgHeight = screenHeight * 0.95;
			svgWidth = screenWidth * 0.8;
		} else {
			svgHeight = screenHeight * 0.8;
			svgWidth = screenWidth * 0.6;
		}

		width = svgWidth - 2 * padding;
		height = svgHeight - 2 * padding;
	}

	// Calculate the number of columns
	$: columns = Math.floor(width / fixedWidth);
	$: rows = Math.ceil(data.length / columns);

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
			<!-- <rect
				x={(i % columns) * (adjustedRectSize + rectPaddingX)}
				y={Math.floor(i / columns) * (adjustedRectSize + rectPaddingY)}
				width={adjustedRectSize}
				height={adjustedRectSize}
				fill={d.pct_nepo > 0 ? colorScale(d.pct_nepo) : 'grey'}
				stroke={$hoveredDatapoint && $hoveredDatapoint.id === d.id ? 'red' : 'none'}
				on:mouseover={function (event) {
					handleMouseover(event, d);
				}}
				on:mouseout={function () {
					handleMouseout();
				}}
			/> -->

			<image
				x={(i % columns) * fixedWidth}
				y={Math.floor(i / columns) * fixedHeight}
				width={fixedWidth}
				height={fixedHeight}
				href={d.image || ''}
				style={{ display: d.image ? 'block' : 'none' }}
				on:mouseover={(event) => handleMouseover(event, d)}
				on:mouseout={() => handleMouseout()}
				onerror={(event) => {
					event.target.style.display = 'none';
				}}
				loading="lazy"
			/>

			<rect
				x={(i % columns) * fixedWidth}
				y={Math.floor(i / columns) * fixedHeight}
				width={fixedWidth}
				height={fixedHeight}
				fill="none"
				stroke={$hoveredDatapoint && $hoveredDatapoint.id === d.id ? 'black' : 'none'}
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
