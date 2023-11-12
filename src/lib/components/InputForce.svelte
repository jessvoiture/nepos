<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let data;

	const getImageLink = function (d) {
		const imagePath = d.hasImage > 0 ? d.image : '/images/noImage.jpg';

		return imagePath;
	};

	onMount(() => {
		const width = 800,
			height = 600;

		let nodeRadiusNepo = 80;
		let imageSizeNepo = nodeRadiusNepo * 3;
		let imageXTranslationNepo = -(nodeRadiusNepo / 2);
		let imageYTranslationNepo = -(nodeRadiusNepo / 10);

		let nodeRadiusLink = 40;
		let imageSizeLink = nodeRadiusLink * 3;
		let imageXTranslationLink = -(nodeRadiusLink / 2);
		let imageYTranslationLink = -(nodeRadiusLink / 10);

		let linkLength = nodeRadiusNepo * 2 + nodeRadiusLink * 2;

		// Convert the data to a suitable format for D3
		const nodes = [data, ...data.parents];
		const links = data.parents.map((parent) => ({
			source: data.name,
			target: parent.name,
			relationship: parent.relationship
		}));

		// Create the SVG container
		const svg = d3.select('#graph').attr('width', width).attr('height', height);

		// Create the simulation
		const simulation = d3
			.forceSimulation(nodes)
			.force(
				'link',
				d3
					.forceLink(links)
					.id((d) => d.name)
					.distance(linkLength)
			)
			.force('charge', d3.forceManyBody().strength(-50))
			.force('center', d3.forceCenter(width / 2, height / 2))
			.force('collide', d3.forceCollide(10));

		console.log('link', links);
		// Create links
		const link = svg
			.append('g')
			.attr('stroke', 'black')
			.selectAll('line')
			.data(links)
			.join('line')
			.attr('stroke-width', 2)
			.attr('class', (d) => {
				return ['Mother', 'Father', 'Parents', 'Parent'].includes(d.relationship)
					? 'solid'
					: 'dashed';
			});

		// Create nodes
		const node = svg
			.append('g')
			.attr('stroke', 'black')
			.attr('stroke-width', 2)
			.selectAll('circle')
			.data(nodes)
			.join('circle')
			.attr('r', (d) => {
				return d.level == 'nepo' ? nodeRadiusNepo : nodeRadiusLink;
			})
			.attr('fill', 'lightblue');

		// place image in each node
		const defs = svg.append('defs');
		nodes.forEach((node) => {
			defs
				.append('pattern')
				.attr('id', 'image-' + node.name.replace(/\s/g, '-'))
				.attr('width', 1)
				.attr('height', 1)
				.append('image')
				.attr('xlink:href', getImageLink(node))
				.attr('width', node.level == 'nepo' ? imageSizeNepo : imageSizeLink)
				.attr('height', node.level == 'nepo' ? imageSizeNepo : imageSizeLink)
				.attr('x', node.level == 'nepo' ? imageXTranslationNepo : imageXTranslationLink)
				.attr('y', node.level == 'nepo' ? imageYTranslationNepo : imageYTranslationLink);
		});

		// Apply the pattern to each node
		node.attr('fill', (d) => `url(#image-${d.name.replace(/\s/g, '-')})`);

		// defs
		// 	.selectAll('.node-text-path')
		// 	.data(nodes)
		// 	.enter()
		// 	.append('path')
		// 	.attr('id', (d) => `text-path-${d.name.replace(/\s/g, '-')}`)
		// 	.attr(
		// 		'd',
		// 		(d) => `
		//         M ${d.x - nodeRadius}, ${d.y}
		//         a ${nodeRadius},${nodeRadius} 0 1,1 ${nodeRadius * 2},0
		//         a ${nodeRadius},${nodeRadius} 0 1,1 -${nodeRadius * 2},0
		//             `
		// 	);

		// Create text elements
		// svg
		// 	.selectAll('.node-text')
		// 	.data(nodes)
		// 	.enter()
		// 	.append('text')
		// 	.append('textPath')
		// 	.attr('xlink:href', (d) => `#text-path-${d.name.replace(/\s/g, '-')}`)
		// 	.style('text-anchor', 'middle')
		// 	.attr('startOffset', '50%')
		// 	.text((d) => d.name);

		// Update positions on each tick
		simulation.on('tick', () => {
			link
				.attr('x1', (d) => d.source.x)
				.attr('y1', (d) => d.source.y)
				.attr('x2', (d) => d.target.x)
				.attr('y2', (d) => d.target.y);

			node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

			// nodeLabel.attr('x', (d) => d.x + 8).attr('y', (d) => d.y);

			// defs.selectAll('.node-text-path').attr(
			// 	'd',
			// 	(d) => `
			//         M ${d.x - nodeRadius(d)}, ${d.y}
			//         a ${nodeRadius(d)},${nodeRadius(d)} 0 1,1 ${nodeRadius(d) * 2},0
			//         a ${nodeRadius(d)},${nodeRadius(d)} 0 1,1 -${nodeRadius(d) * 2},0
			//         `
			// );
		});
	});
</script>

<svg id="graph" />
