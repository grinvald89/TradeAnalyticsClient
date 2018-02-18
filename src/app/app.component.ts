import { Component, OnInit, ViewChild } from '@angular/core';

interface iChart {
	value: number;
	minute: number;
};

const sizes = {
	value: 50,
	minute: 60,
	svg: {
		height: 400,
		width: 1600
	}
};

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
	@ViewChild('svg') svg;

	chart: iChart[] = [
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

	scaleValues: number[] = [];

	path: string;

	ngOnInit() {
		let minValue = this.chart[0].value,
			maxValue = this.chart[0].value;

		this.chart.forEach((item, index) => {
			let coordinate = item.minute * sizes.minute + "," + (sizes.svg.height - (item.value * sizes.value));

			if (!index)
				this.path = "M " + coordinate + " L";
			else
				this.path += " " + coordinate;

			if (item.value < minValue)
				minValue = item.value;

			if (item.value > maxValue)
				maxValue = item.value;
		});

		let i = sizes.svg.height / sizes.value,
			item = (maxValue - minValue) / (sizes.svg.height / sizes.value);

		while (i >= 0) {
			this.scaleValues.push(item * i);
			i--;
		}		

		let newpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
		newpath.setAttribute("d", this.path);
		newpath.setAttribute("stroke", "green");
		newpath.setAttribute("stroke-width", "1");
		newpath.setAttribute("fill", "none");

		this.svg.nativeElement.appendChild(newpath);

		this.svg.nativeElement.setAttribute("width", sizes.svg.width + "px");
		this.svg.nativeElement.setAttribute("height", sizes.svg.height + "px");
	}
}
