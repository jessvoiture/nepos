import {
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

	let blueLinks;
	let processedBlueLinks;
	let nepoRelationshipType;
	let isNepo;

	if (doBlueLinksExist.parent) {
		// if parents are blue linked only get parents
		blueLinks = getParentLinks(wikiInfo);
		nepoRelationshipType = 'parent';
		isNepo = true;
	} else if (doBlueLinksExist.relative && !doBlueLinksExist.parent) {
		// nepo by relatives but not by parent
		blueLinks = getRelativeLinks(wikiInfo);

		isNepo = blueLinks.length > 0;
		nepoRelationshipType = isNepo ? 'relative' : 'none';
	} else {
		nepoRelationshipType = 'none';
		isNepo = false;
	}

	if (isNepo) {
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
		nepo: isNepo,
		nepoRelationshipType: nepoRelationshipType,
		parents: processedBlueLinks
	};

	return poiResult;
}

export const actions = {
	default: async ({ request }) => {
		// get data from client
		const formData = await request.formData();
		const name = formData.get('name');

		// determine if they are a nepo
		const editedName = removeWS(name);
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
				nepoRelationshipType: 'none',
				parents: []
			};
		}

		return {
			success: true,
			data: poiResult
		};
	}
};
