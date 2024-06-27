<script>
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
</script>

<svg width={svgWidth} height={svgHeight}>
	<g transform={`translate(${padding}, ${padding})`}>
		{#each data as item, i}
			<rect
				x={(i % columns) * (adjustedRectSize + rectPaddingX)}
				y={Math.floor(i / columns) * (adjustedRectSize + rectPaddingY)}
				width={adjustedRectSize}
				height={adjustedRectSize}
				fill="blue"
			/>
		{/each}
	</g>
</svg>

<style>
	/* You can add styles here if needed */
</style>
