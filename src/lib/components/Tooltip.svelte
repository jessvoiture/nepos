<script>
	import { hoveredDatapoint, mouseX, mouseY } from '../stores';

	export let screenWidth;
	export let screenHeight;

	let adjustedMouseX;
	let adjustedMouseY;

	let tooltipWidth = 200;
	let tooltipHeight = 350;

	if ($mouseX + tooltipWidth + 50 < screenWidth) {
		adjustedMouseX = $mouseX + 10;
	} else {
		adjustedMouseX = $mouseX - tooltipWidth - 50;
	}

	if ($mouseY + tooltipHeight + 50 < screenHeight) {
		adjustedMouseY = $mouseY + 10;
	} else {
		adjustedMouseY = $mouseY - tooltipHeight;
	}

	function handleImageError(event) {
		event.target.style.display = 'none';
	}
</script>

<div
	class="tooltip"
	style="left: {adjustedMouseX}px; 
          top: {adjustedMouseY}px;
          width: {tooltipWidth}px;"
>
	<div class="tooltip-content body-text">
		<div class="tooltip-header">
			<div class="tooltip-title">{$hoveredDatapoint.title}, {$hoveredDatapoint.year}</div>
			<!-- <div class="tooltip-percentage">{Math.round($hoveredDatapoint.pct_nepo * 100)}%</div> -->
		</div>
	</div>

	<div class="tooltip-image">
		<div class="image-container">
			<img
				src={$hoveredDatapoint.image}
				alt="Poster for {$hoveredDatapoint.title}"
				on:error={handleImageError}
				loading="lazy"
			/>
		</div>
	</div>
</div>

<style lang="scss" scoped>
	.tooltip {
		position: fixed;
		background-color: white;
		border: 1px solid #ccc;
		border-radius: 8px;
		padding: 16px;
	}

	.tooltip-image {
		flex: 0 0 auto; /* The left column (image) won't grow or shrink */
		position: relative;
	}

	.tooltip-image img {
		width: 100px;
		height: auto;
	}

	.tooltip-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
