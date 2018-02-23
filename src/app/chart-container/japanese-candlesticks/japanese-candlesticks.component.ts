import { Component, OnInit, ViewChild } from '@angular/core';

import { DataService } from '../../data.service';
import { TimeService } from '../../time.service';

import { IRate } from '../../i-rate';

const Sizes = {
	grid: {
		value: 50,
		time: 18
	},

	chart: {
		value: 400,
		time: 1835
	},

	take: 100
}

@Component({
	selector: 'app-japanese-candlesticks',
	templateUrl: './japanese-candlesticks.component.html',
	styleUrls: ['./japanese-candlesticks.component.scss']
})

export class JapaneseCandlesticksComponent implements OnInit {
	@ViewChild('svg') svg;

	gridValues: number[] = [];
	gridTimes: any[] = [];

	rates: IRate[] = [];
	timeFrame: number = 1;

	// Максимальное количество знаков после запятой, считается по High
	digits: number = 0;

	clientX: number = 0;

	extremes = {
		min: 0,
		max: 0
	};

	constructor(
		private dataService: DataService,
		private timeService: TimeService
	) { }

	drawChart(): void {
		this.setGrid();

		this.rates.forEach((item, index) => {
			let getValue = value => {
				let rangeDifference = this.extremes.max - this.extremes.min,
					valuePos = value - this.extremes.min,
					percentPos = valuePos / rangeDifference * 100;

				return Sizes.chart.value * percentPos / 100;
			};

			let y1 = item.Open > item.Close ? item.Open : item.Close,
				y2 = item.Open > item.Close ? item.Close : item.Open,
				color = "#000";

			if (index > 0) {
				if (this.rates[index - 1].Close <= this.rates[index].Close)
					color = "#2aa76d";
				else
					color = "#df553a";
			}

			let body = document.createElementNS("http://www.w3.org/2000/svg", "line");
			body.setAttribute("x1", (index * Sizes.grid.time).toString());
			body.setAttribute("y1", (Sizes.chart.value - getValue(y1)).toString());
			body.setAttribute("x2", (index * Sizes.grid.time).toString());
			body.setAttribute("y2", (Sizes.chart.value - getValue(y2)).toString());
			body.setAttribute("stroke", color);
			body.setAttribute("stroke-width", "10");

			this.svg.nativeElement.appendChild(body);


			let shadow = document.createElementNS("http://www.w3.org/2000/svg", "line");
			shadow.setAttribute("x1", (index * Sizes.grid.time).toString());
			shadow.setAttribute("y1", (Sizes.chart.value - getValue(item.High)).toString());
			shadow.setAttribute("x2", (index * Sizes.grid.time).toString());
			shadow.setAttribute("y2", (Sizes.chart.value - getValue(item.Low)).toString());
			shadow.setAttribute("stroke", color);
			shadow.setAttribute("stroke-width", "1");

			this.svg.nativeElement.appendChild(shadow);
		});

		this.svg.nativeElement.setAttribute("width", Sizes.chart.time);
		this.svg.nativeElement.setAttribute("height", Sizes.chart.value);
	}

	setGrid(): void {
			this.extremes.min = this.rates[0].Low;
			this.extremes.max = this.rates[0].High;

			this.rates.forEach(item => {
				if (item.Low < this.extremes.min)
					this.extremes.min = item.Low;

				if (item.High > this.extremes.max)
					this.extremes.max = item.High;
			});

			const scaleValue = (this.extremes.max - this.extremes.min) / (Sizes.chart.value / Sizes.grid.value);

			let value = this.extremes.max,
				i = Sizes.chart.value / Sizes.grid.value;

			while(i > 0) {
				this.gridValues.push(Math.round(value * Math.pow(10, this.digits)) / Math.pow(10, this.digits));
				value -= scaleValue;
				i--;
			}

			this.gridValues.push(this.extremes.min);


			for (let i = 0; i <= Math.floor(Sizes.chart.value / Sizes.grid.value); i++) {
				let newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
				newLine.setAttribute("x1", "0");
				newLine.setAttribute("y1", (i * Sizes.grid.value).toString());
				newLine.setAttribute("x2", Sizes.chart.time.toString());
				newLine.setAttribute("y2", (i * Sizes.grid.value).toString());
				newLine.setAttribute("stroke", "#000");
				newLine.setAttribute("stroke-width", "0.1");

				this.svg.nativeElement.appendChild(newLine);
			}

			for (let i = 0; i <= Math.floor(Sizes.chart.time / Sizes.grid.time); i++) {
				let newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
				newLine.setAttribute("x1", (i * Sizes.grid.time).toString());
				newLine.setAttribute("y1", Sizes.chart.value.toString());
				newLine.setAttribute("x2", (i * Sizes.grid.time).toString());
				newLine.setAttribute("y2", "0");
				newLine.setAttribute("stroke", "#000");
				newLine.setAttribute("stroke-width", "0.1");

				this.svg.nativeElement.appendChild(newLine);
			}
	}

	visibleTime(DateTime: string): string | void {
		let day = DateTime.substr(DateTime.search(/^[0-9]{2}./), 2),
			mounth = DateTime.substr(DateTime.search(/.[0-9]{2}./) + 1, 2),
			hour = DateTime.substr(DateTime.search(/\s[0-9]{1,2}:/) + 1, 2),
			minute = DateTime.substr(DateTime.search(/:[0-9]{2}:/) + 1, 2);

		return (parseInt(minute) % (this.timeFrame * 10) === 0) ? day + "/" + mounth + " " + hour + ":" + minute : "";
	}

	onMouseDown(event) {
		this.clientX = event.clientX;
	}

	onMouseUp(event) {
		let pxShift = event.clientX - this.clientX;

		if(pxShift > 0) {
			let iShift = Math.floor(pxShift / Sizes.grid.time),
				startPos = (this.rates.length < (iShift + 1)) ? this.rates[this.rates.length - iShift - 1] : this.rates[0];

			this.getRates(Sizes.take, 1, this.timeFrame, this.timeService.toDateTime(startPos.Date));
		}
		else {
			let iShift = Math.floor((pxShift * -1) / Sizes.grid.time),
				startPos = this.rates[this.rates.length - 1 - iShift];

			this.getRates(Sizes.take, 1, this.timeFrame, this.timeService.toDateTime(startPos.Date), true);
		}
	}

	getRates(take: number, pairid: number, timeFrame: number, date?: string, isforward?: boolean) {
		this.svg.nativeElement.innerHTML = "";

		this.dataService.getRates(take, pairid, this.timeFrame, date, isforward)
			.subscribe(res => {				
				this.digits = 1;
				res.forEach(item => {
					let iDot = item.High.toString().indexOf(".");

					if (iDot != -1 && item.High.toString().substr(iDot + 1).length > this.digits)
						this.digits = item.High.toString().substr(iDot + 1).length;
				});

				this.rates = res;

				if (res.length)
					this.drawChart();
			});
	}

	ngOnInit() {
		this.getRates(Sizes.take, 1, this.timeFrame);
	}
}