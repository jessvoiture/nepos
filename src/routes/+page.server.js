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

	let blueLinks;
	let blueLinksMother;
	let blueLinksFather;
	let processedBlueLinks;
	let nepoRelationshipType;
	let hasLinks;

	if (doBlueLinksExist.parent) {
		// if parents are blue linked only get parents
		blueLinks = getParentLinks(wikiInfo, 'Parent');
		nepoRelationshipType = 'parent';
		hasLinks = true;
	} else if (doBlueLinksExist.relative && !doBlueLinksExist.parent) {
		// nepo by relatives but not by parent
		blueLinks = getRelativeLinks(wikiInfo);
		hasLinks = blueLinks.length > 0;
		nepoRelationshipType = hasLinks ? 'relative' : 'none';
	} else if (doBlueLinksExist.mother && !doBlueLinksExist.father) {
		// mother field
		blueLinks = getParentLinks(wikiInfo, 'Mother');
		nepoRelationshipType = 'parent';
		hasLinks = true;
	} else if (!doBlueLinksExist.mother && doBlueLinksExist.father) {
		// father field
		blueLinks = getParentLinks(wikiInfo, 'Father');
		nepoRelationshipType = 'parent';
		hasLinks = true;
	} else if (doBlueLinksExist.mother && doBlueLinksExist.father) {
		// mother and father field
		blueLinksMother = getParentLinks(wikiInfo, 'Father');
		blueLinksFather = getParentLinks(wikiInfo, 'Mother');
		blueLinks = blueLinksMother.concat(blueLinksFather);

		nepoRelationshipType = 'parent';
		hasLinks = true;
	} else if (!doBlueLinksExist.any) {
		// none of the fields
		nepoRelationshipType = 'none';
		hasLinks = false;
	}

	if (hasLinks) {
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
		nepoRelationshipType: nepoRelationshipType,
		parents: processedBlueLinks
	};

	// console.log('name', name);
	// console.log('do blue links exist', doBlueLinksExist);
	// console.log('hasLinks', hasLinks);
	// console.log('nepoRelationshipType', nepoRelationshipType);
	// console.log('nepo', processedBlueLinks.length > 0);
	// console.log('processedblueLinks', processedBlueLinks);

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
