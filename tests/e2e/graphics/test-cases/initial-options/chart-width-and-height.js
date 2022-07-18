function generateData() {
	const res = [];
	const time = new Date(Date.UTC(2018, 0, 1, 0, 0, 0, 0));
	for (let i = 0; i < 500; ++i) {
		res.push({
			time: time.getTime(),
			value: i,
		});

		time.setUTCDate(time.getUTCDate() + 1);
	}

	return res;
}

function runTestCase(container) {
	const configs = [{}, { width: 500 }, { height: 100 }, { width: 500, height: 100 }];

	configs.forEach((config, i) => {
		const box = document.createElement('div');

		box.style.position = 'absolute';
		box.style.top = `${i * 25}%`;
		box.style.left = 0;
		box.style.right = 0;
		box.style.height = '25%';

		container.appendChild(box);

		const chart = LightweightCharts.createChart(box, config);
		const mainSeries = chart.addAreaSeries();

		mainSeries.setData(generateData());
	});
}
