function runTestCase(container) {
	const chart = LightweightCharts.createChart(container);

	const lineSeries = chart.addLineSeries({
		lineType: LightweightCharts.LineType.Curved,
	});

	const data = [
		{ time: new Date(2000, 0, 1).getTime(), value: 5 },
		{ time: new Date(2000, 1, 1).getTime(), value: 15 },
	];

	lineSeries.setData(data);

	chart.timeScale().fitContent();
}
