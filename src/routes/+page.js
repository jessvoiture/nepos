export const load = ({ fetch }) => {
	// const fetchText = async () => {
	//   const res = await fetch("/data/mag_text.json");
	//   const data = await res.json();

	//   data.forEach(function (entry) {
	//     var dateString = entry.Date;
	//     var month = dateString.slice(4, 6);
	//     entry.month = +month;
	//     entry.year = +entry.year;
	//     entry.Date = +entry.Date;
	//   });

	//   return data;
	// };

	const fetchNepoData = async () => {
		const res = await fetch('/data/all-nepo.json');
		const data = await res.json();

		return data;
	};

	const fetchNepoOutput = async () => {
		const res = await fetch('/data/output.json');
		const data = await res.json();

		return data;
	};

	return {
		// nepos: fetchNepoData(),
		data: fetchNepoOutput()
	};
};
