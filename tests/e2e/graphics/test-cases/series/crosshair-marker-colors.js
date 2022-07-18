function generateData(step) {
	const res = [];
	const time = new Date(Date.UTC(2018, 0, 1, 0, 0, 0, 0));
	let value = step > 0 ? 0 : 500;
	for (let i = 0; i < 500; ++i) {
		res.push({
			time: time.getTime(),
			value: value,
		});

		value += step;

		time.setUTCDate(time.getUTCDate() + 1);
	}
	return res;
}

function runTestCase(container) {
	const chart = LightweightCharts.createChart(container);

	const areaSeries = chart.addAreaSeries({
		crosshairMarkerBorderColor: 'yellow',
		crosshairMarkerBackgroundColor: 'red',
	});

	const lineSeries = chart.addLineSeries({
		crosshairMarkerBorderColor: 'blue',
		crosshairMarkerBackgroundColor: 'green',
	});

	areaSeries.setData(generateData(1));
	lineSeries.setData(generateData(-1));
}
