import { Component, Input, ViewChild } from '@angular/core';

const sizes = {
	value: 50,
	minute: 60,
	svg: {
		height: 400,
		width: 1810
	}
};

@Component({
	selector: 'app-area-chart',
	templateUrl: './area-chart.component.html',
	styleUrls: ['./area-chart.component.scss']
})

export class AreaChartComponent {
	rates = [
		{
			value: 1.2,
			minute: 0
		},
		{
			value: 2.2,
			minute: 1
		},
		{
			value: 0,
			minute: 2
		},
		{
			value: 1,
			minute: 3
		},
		{
			value: 5,
			minute: 4
		}
	];

	@ViewChild('svg') svg;

	scaleValues: number[] = [];

	extremes = { min: 0, max: 0 };

	constructor() { }

	drawChart() {
		this.getExtremes();

		this.setScaleValues();

		let path;

		this.rates.forEach((item, index) => {
			let kScale = (this.extremes.max - this.extremes.min) / (sizes.svg.height / sizes.value),
				coordinate = item.minute * sizes.minute + "," + (sizes.svg.height - ((item.value / kScale) * sizes.value));

			if (!index)
				path = "M " + coordinate + " L";
			else
				path += " " + coordinate;
		});

		this.setGrid();

		let newpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
		newpath.setAttribute("d", path);
		newpath.setAttribute("stroke", "green");
		newpath.setAttribute("stroke-width", "1");
		newpath.setAttribute("fill", "none");

		this.svg.nativeElement.appendChild(newpath);

		this.svg.nativeElement.setAttribute("width", sizes.svg.width);
		this.svg.nativeElement.setAttribute("height", sizes.svg.height);
	}

	getExtremes() {
		this.extremes.min = this.rates[0].value;
		this.extremes.max  = this.rates[0].value;

		this.rates.forEach((item, index) => {
			if (item.value < this.extremes.min)
				this.extremes.min = item.value;

			if (item.value > this.extremes.max)
				this.extremes.max = item.value;
		});
	}

	setScaleValues() {
		let i = sizes.svg.height / sizes.value,
			item = (this.extremes.max - this.extremes.min) / (sizes.svg.height / sizes.value);

		while (i >= 0) {
			this.scaleValues.push(item * i);
			i--;
		}
	}

	setGrid() {
		for (var i = 0; i <= Math.floor(sizes.svg.height / sizes.value); i++) {
			let newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
			newLine.setAttribute("x1", "0");
			newLine.setAttribute("y1", (i * sizes.value).toString());
			newLine.setAttribute("x2", sizes.svg.width.toString());
			newLine.setAttribute("y2", (i * sizes.value).toString());
			newLine.setAttribute("stroke", "#000");
			newLine.setAttribute("stroke-width", "0.1");

			this.svg.nativeElement.appendChild(newLine);
		}

		for (var i = 0; i <= Math.floor(sizes.svg.width / sizes.minute); i++) {
			let newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
			newLine.setAttribute("x1", (i * sizes.minute).toString());
			newLine.setAttribute("y1", sizes.svg.height.toString());
			newLine.setAttribute("x2", (i * sizes.minute).toString());
			newLine.setAttribute("y2", "0");
			newLine.setAttribute("stroke", "#000");
			newLine.setAttribute("stroke-width", "0.1");

			this.svg.nativeElement.appendChild(newLine);
		}
	}

	ngOnChanges(changes) {
		if (changes.rates)
			this.drawChart();
	}
}