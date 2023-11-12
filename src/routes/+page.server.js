import {
	toTitleCase,
	removeWS,
	fetchWikipediaInfo,
	doesWikiExist,
	extractInfoboxImageSrc,
	doBlueLinkFieldsExist,
	getParentLinks,
	getRelativeLinks,
	getBlueLinkData
} from '../utils/main.js';

async function extractInfoboxData(wikiInfo, name, wikiUrl) {
	const image = extractInfoboxImageSrc(wikiInfo);
	const doBlueLinksExist = doBlueLinkFieldsExist(wikiInfo);

	let blueLinks = [];
	let processedBlueLinks;

	// Collect links for each true condition.
	if (doBlueLinksExist.parent) {
		let parentLinks = getParentLinks(wikiInfo, 'Parent');
		blueLinks = blueLinks.concat(parentLinks);
	}

	if (doBlueLinksExist.parents) {
		let parentsLinks = getParentLinks(wikiInfo, 'Parents');
		blueLinks = blueLinks.concat(parentsLinks);
	}

	if (doBlueLinksExist.mother) {
		let motherLinks = getParentLinks(wikiInfo, 'Mother');
		blueLinks = blueLinks.concat(motherLinks);
	}

	if (doBlueLinksExist.father) {
		let fatherLinks = getParentLinks(wikiInfo, 'Father');
		blueLinks = blueLinks.concat(fatherLinks);
	}

	if (doBlueLinksExist.relative) {
		let relativeLinks = getRelativeLinks(wikiInfo, 'Relatives');
		if (relativeLinks.length > 0) {
			blueLinks = blueLinks.concat(relativeLinks);
		}
	}

	if (doBlueLinksExist.family) {
		let familyLinks = getRelativeLinks(wikiInfo, 'Family');
		if (familyLinks.length > 0) {
			console.log('family links', familyLinks);
		}
	}

	if (blueLinks.length > 0) {
		processedBlueLinks = await getBlueLinkData(blueLinks);
	} else {
		processedBlueLinks = [];
	}

	const poiResult = {
		name: name,
		hasWiki: true,
		link: wikiUrl,
		hasImage: image.length > 0,
		image: image,
		nepo: processedBlueLinks.length > 0,
		parents: processedBlueLinks,
		level: 'nepo'
	};

	return poiResult;
}

export const actions = {
	default: async ({ request }) => {
		// get data from client
		const formData = await request.formData();
		const name = formData.get('name');

		// determine if they are a nepo
		const editedName = removeWS(toTitleCase(name));
		const wikiUrl = `https://en.wikipedia.org/wiki/${editedName}`;

		const wikiExists = await doesWikiExist(editedName);
		let poiResult;

		if (wikiExists) {
			const wikiInfo = await fetchWikipediaInfo(wikiUrl);
			poiResult = await extractInfoboxData(wikiInfo, name, wikiUrl);
		} else {
			poiResult = {
				name: name,
				hasWiki: false,
				link: '',
				hasImage: false,
				image: '',
				nepo: false,
				parents: []
			};
		}

		return {
			success: true,
			data: poiResult
		};
	}
};
