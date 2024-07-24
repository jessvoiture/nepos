<script>
	import { hoveredDatapoint, mouseX, mouseY } from '../stores';
	import Tooltip from './Tooltip.svelte';
	import Scroll from './Scrolly.svelte';

	export let data;
	export let screenHeight;
	export let screenWidth;

	data.sort((a, b) => {
		return a.nepoCount - b.nepoCount;
	});

	let svgHeight;
	let svgWidth;
	let height;
	let width;
	let totalPaddingWidth;
	let totalPaddingHeight;
	let rectSize;
	let rectHeight;
	let stepWidth;

	let currentStep = 0;
	let greyedOutClass = '';

	const minRectPadding = 4;
	const padding = 15;
	const fixedWidth = 20;
	const fixedHeight = (20 * 7) / 5;
	const steps = [
		// 0
		`<p>All the posters sorted by year</p>`,
		// 1
		'<p>The posters but coloured by nepo or not</p>'
	];

	// dimensions
	$: {
		if (screenWidth < screenHeight) {
			// portrait
			svgHeight = screenHeight * 0.95;
			svgWidth = screenWidth * 0.8;
			stepWidth = 0.9 * screenWidth;
		} else {
			// landscape
			svgHeight = screenHeight * 0.8;
			svgWidth = screenWidth * 0.6;
			stepWidth = 0.5 * screenWidth;
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

	$: if (currentStep == 0) {
		greyedOutClass = 'poster';
	} else if (currentStep == 1) {
		greyedOutClass = 'greyscale';
	}

	const handleMouseover = function (event, d) {
		hoveredDatapoint.set(d);
		mouseX.set(event.clientX);
		mouseY.set(event.clientY);
	};

	const handleMouseout = function () {
		hoveredDatapoint.set(undefined);
	};
</script>

<div class="scroller">
	<div class="grid">
		<svg width={svgWidth} height={svgHeight}>
			<g transform={`translate(${padding}, ${padding})`}>
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-mouse-events-have-key-events -->
				{#each data as d, i}
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<image
						x={(i % columns) * fixedWidth}
						y={Math.floor(i / columns) * fixedHeight}
						width={fixedWidth}
						height={fixedHeight}
						class={d.nepoCount == 0 ? greyedOutClass : 'poster'}
						href={d.image || ''}
						style={{ filter: 'grayscale(1)' }}
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
					/>
				{/each}
			</g>
		</svg>
	</div>

	<div class="steps-wrapper">
		<Scroll bind:value={currentStep}>
			{#each steps as text, i}
				<div class="step" class:active={currentStep === i}>
					<div class="step-content" width={stepWidth}>
						{@html text}
					</div>
				</div>
			{/each}
		</Scroll>
	</div>
</div>

{#if $hoveredDatapoint != undefined}
	<Tooltip {screenWidth} {screenHeight} />
{/if}

<style>
	.greyscale {
		transition: opacity 0.3s ease-in-out, filter 0.3s ease-in-out;
		filter: grayscale(100%);
		opacity: 50%;
	}

	.grid {
		position: sticky;
		margin: auto;
		flex: 1 1 60%;
		top: 0vh;
		height: 100vh;
		z-index: 0 !important;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
