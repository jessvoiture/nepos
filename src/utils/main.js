import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const WIKI_BASE_URL = 'https://en.wikipedia.org';

export function removeWS(words) {
	return words.replace(/ /g, '_');
}

// checks if wiki page exists given string
export async function doesWikiExist(title) {
	const endpoint =
		WIKI_BASE_URL +
		`/w/api.php?action=query&format=json&titles=${encodeURIComponent(title)}&origin=*`;

	console.log('Title being checked:', title); // Log the title being queried

	try {
		const response = await fetch(endpoint);
		console.log('Response status:', response.status); // Log the response status

		const data = await response.json();
		console.log('API response data:', data); // Log the full API response data

		const page = Object.values(data.query.pages)[0];
		console.log('Extracted page data:', page); // Log the extracted page data

		return !!page.pageid;
	} catch (error) {
		console.error('Error checking Wikipedia page:', error);
		return false;
	}
}

// gets infobox from wikipedia page
export async function fetchWikipediaInfo(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			console.error(
				`Failed to fetch Wikipedia info for URL "${url}" with status ${response.status}`
			);
			return '';
		}
		const body = await response.text();

		const $ = cheerio.load(body);
		return (
			$('.infobox.biography.vcard').parent().html() || $('table.infobox.vcard').parent().html()
		);
	} catch (error) {
		console.error(`Error fetching Wikipedia Infobox for URL "${url}":`, error);
		return '';
	}
}

// gets image from infobox
export function extractInfoboxImageSrc(infoboxContent) {
	const $ = cheerio.load(infoboxContent);
	const imageUrl = $('img:first').attr('src');
	return imageUrl ? 'https:' + imageUrl : '';
}

// determines if the parent or relative field exists
export function doBlueLinkFieldsExist(infoboxContent) {
	const $ = cheerio.load(infoboxContent);

	const areParentsLinked = $('th:contains("Parent")').next('td').find('a').length > 0;
	const areRelativesLinked = $('th:contains("Relative")').next('td').find('a').length > 0;

	const blueLinkFieldsStatus = {
		either: areParentsLinked || areRelativesLinked,
		parent: areParentsLinked,
		relative: areRelativesLinked
	};

	return blueLinkFieldsStatus;
}

// gets parent links
export function getParentLinks(infoboxContent) {
	const $ = cheerio.load(infoboxContent);

	const $parentsData = $('th:contains("Parent")').next();

	const parentsArray = [];
	$parentsData.find('a').each(function () {
		let name = $(this).text();
		let link = $(this).attr('href');
		parentsArray.push({
			name: name,
			link: WIKI_BASE_URL + link
		});
	});

	return parentsArray;
}

// get relative links
export function getRelativeLinks(infoboxContent) {
	const nonNepoRelationships = new RegExp(
		'son|daughter|nephew|niece|grandson|grand-daughter|grandnephew|grandniece|in-law|stepson|stepdaughter|brother|sister|cousin'
	);

	const $ = cheerio.load(infoboxContent);
	const $relativesData = $('th:contains("Relative")').next();

	const relativesArray = [];
	$relativesData
		.find('a')
		.parent()
		.each(function () {
			let $a = $(this).find('a');

			let name = $a.text();
			let link = $a.attr('href');

			let isNepoRelationship = !nonNepoRelationships.test($(this).text());

			if (isNepoRelationship) {
				relativesArray.push({
					name: name,
					link: WIKI_BASE_URL + link
				});
			}
		});

	return relativesArray;
}

export async function getBlueLinkData(blueLinks) {
	try {
		const results = await Promise.all(
			blueLinks.map(async (blueLink) => {
				const fetchedInfo = await fetchWikipediaInfo(blueLink.link);
				const image = extractInfoboxImageSrc(fetchedInfo);

				blueLink.image = image || '';
				return blueLink;
			})
		);

		return results;
	} catch (error) {
		console.error('Error retrieving Wikipedia Infobox links:', error);
		return [];
	}
}
