function generateData() {
	const res = [];
	const time = new Date(Date.UTC(2018, 0, 1, 0, 0, 0, 0));
	for (let i = 0; i < 1000; ++i) {
		res.push({
			time: time.getTime(),
			value: i,
		});

		time.setUTCDate(time.getUTCDate() + 1);
	}
	return res;
}

function runTestCase(container) {
	const chart = LightweightCharts.createChart(container);

	const mainSeries = chart.addLineSeries();

	mainSeries.setData(generateData());

	return new Promise(resolve => {
		setTimeout(() => {
			chart.timeScale().setVisibleRange({
				from: (new Date(Date.UTC(2018, 0, 1, 0, 0, 0, 0))).getTime(),
				to: (new Date(Date.UTC(2018, 1, 1, 0, 0, 0, 0))).getTime(),
			});

			resolve();
		}, 1000);
	});
}
