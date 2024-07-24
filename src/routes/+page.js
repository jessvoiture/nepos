export const load = ({ fetch }) => {
	const fetchNepoOutput = async () => {
		const res = await fetch('/data/output.json');
		const data = await res.json();

		data.forEach((item) => {
			item.nepoCount = item.cast.filter((castMember) => castMember.nepo === true).length;
			item.year_released = Number(item.year.substring(0, 4));
		});

		return data;
	};

	return {
		data: fetchNepoOutput()
	};
};
