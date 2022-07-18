const startDate = new Date(Date.UTC(2018, 0, 1, 0, 0, 0, 0));
const endDate = new Date(Date.UTC(2019, 0, 1, 0, 0, 0, 0));

function generateData() {
	const res = [];

	const time = new Date(startDate);
	for (let i = 0; time.getTime() < endDate.getTime(); ++i) {
		res.push({
			time: time.getTime(),
			value: i / 1000 + 0.6,
		});

		time.setUTCDate(time.getUTCDate() + 1);
	}

	return res;
}

function runTestCase(container) {
	const chart = LightweightCharts.createChart(container);

	const firstSeries = chart.addLineSeries();
	const secondSeries = chart.addLineSeries();

	firstSeries.setData(generateData());
	secondSeries.setData([
		{ time: startDate.getTime(), value: 0.5 },
		{ time: endDate.getTime(), value: 0.5 },
	]);
}
