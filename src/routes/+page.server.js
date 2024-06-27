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

		console.log('parent', parentLinks);
	}

	if (doBlueLinksExist.mother) {
		let motherLinks = getParentLinks(wikiInfo, 'Mother');
		blueLinks = blueLinks.concat(motherLinks);

		console.log('motherLinks', motherLinks);
	}

	if (doBlueLinksExist.father) {
		let fatherLinks = getParentLinks(wikiInfo, 'Father');
		blueLinks = blueLinks.concat(fatherLinks);

		console.log('fatherLinks', fatherLinks);
	}

	if (doBlueLinksExist.relative) {
		let relativeLinks = getRelativeLinks(wikiInfo, 'Relatives');
		if (relativeLinks.length > 0) {
			blueLinks = blueLinks.concat(relativeLinks);
		}

		console.log('relativeLinks', relativeLinks);
	}

	if (doBlueLinksExist.family) {
		let familyLinks = getRelativeLinks(wikiInfo, 'Family');
		if (familyLinks.length > 0) {
			blueLinks = blueLinks.concat(familyLinks);
		}

		console.log('familyLinks', familyLinks);
	}

	if (blueLinks.length > 0) {
		const compareObjects = (obj1, obj2) => {
			// Compare based on a specific property, for example, 'id'
			return obj1.name === obj2.name; // Change 'id' to the property you want to compare
		};

		// Use a Set to remove duplicates based on the comparison function
		const uniqueBlueLinks = Array.from(new Set(blueLinks.map(JSON.stringify)), JSON.parse).filter(
			(value, index, self) => self.findIndex((obj) => compareObjects(obj, value)) === index
		);

		processedBlueLinks = await getBlueLinkData(uniqueBlueLinks);
	} else {
		processedBlueLinks = [];
	}

	console.log('final blue links', processedBlueLinks);

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

	console.log('data', poiResult);

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
				name: editedName,
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
