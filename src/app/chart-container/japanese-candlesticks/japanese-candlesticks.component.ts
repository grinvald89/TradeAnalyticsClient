import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { DataService } from '../../data.service';
import { TimeService } from '../../time.service';

import { IRate } from '../../i-rate';

@Component({
	selector: 'app-japanese-candlesticks',
	templateUrl: './japanese-candlesticks.component.html',
	styleUrls: ['./japanese-candlesticks.component.scss']
})

export class JapaneseCandlesticksComponent implements OnInit {
	@Input() Rates: IRate[];
	@Input() Min: number;
	@Input() Max: number;
	@Input() Digits: number;
	@Input() TimeFrame: number;

	@Input() Chart: { width: number; height: number; };
	@Input() Grid: { width: number; height: number; };

	@Output() CalcRateGrid = new EventEmitter<{ min: number; max: number; }>();

	@ViewChild('container') container: ElementRef;
	@ViewChild('wrap') wrap: ElementRef;
	@ViewChild('chart') chart: ElementRef;
	@ViewChild('svg') svg: ElementRef;
	@ViewChild('svgGrid') svgGrid: ElementRef;

	constructor(
		private dataService: DataService,
		private timeService: TimeService
	) { }

	drawChart(): void {
		this.wrap.nativeElement.style.width =
			this.svg.nativeElement.style.width = this.Rates.length * this.Grid.width + "px";

		this.setTimeGrid();

		this.Rates.forEach((item, index) => {
			let getValue = value => {
				let rangeDifference = this.Max - this.Min,
					valuePos = value - this.Min,
					percentPos = valuePos / rangeDifference * 100;

				return this.Chart.height * percentPos / 100;
			};

			let y1 = item.Open > item.Close ? item.Open : item.Close,
				y2 = item.Open > item.Close ? item.Close : item.Open,
				color = "#000";

			if (index > 0)
				color =  (this.Rates[index - 1].Close <= this.Rates[index].Close) ? "#2aa76d" : "#df553a";

			let body = document.createElementNS("http://www.w3.org/2000/svg", "line");
			body.setAttribute("x1", (index * this.Grid.width).toString());
			body.setAttribute("y1", (this.Chart.height - getValue(y1)).toString());
			body.setAttribute("x2", (index * this.Grid.width).toString());
			body.setAttribute("y2", (this.Chart.height - getValue(y2)).toString());
			body.setAttribute("stroke", color);
			body.setAttribute("stroke-width", "10");

			this.svg.nativeElement.appendChild(body);


			let shadow = document.createElementNS("http://www.w3.org/2000/svg", "line");
			shadow.setAttribute("x1", (index * this.Grid.width).toString());
			shadow.setAttribute("y1", (this.Chart.height - getValue(item.High)).toString());
			shadow.setAttribute("x2", (index * this.Grid.width).toString());
			shadow.setAttribute("y2", (this.Chart.height - getValue(item.Low)).toString());
			shadow.setAttribute("stroke", color);
			shadow.setAttribute("stroke-width", "1");

			this.svg.nativeElement.appendChild(shadow);
		});

		this.CalcRateGrid.emit({min: this.Min, max: this.Max});
	}

	setTimeGrid(): void {
		for (let i = 0; i <= Math.floor((this.Rates.length * this.Grid.height) / this.Grid.width); i++) {
			let newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
			newLine.setAttribute("x1", (i * this.Grid.width).toString());
			newLine.setAttribute("y1", this.Chart.height.toString());
			newLine.setAttribute("x2", (i * this.Grid.width).toString());
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

		return (parseInt(minute) % (this.TimeFrame * 10) === 0) ? day + "/" + mounth + " " + hour + ":" + minute : "";
	}

	ngOnInit(): void {
		this.container.nativeElement.onscroll = event => {
			let iStart = Math.floor(event.srcElement.scrollLeft / this.Grid.width),
				start = this.Rates[iStart],
				iEnd = Math.floor((event.srcElement.scrollLeft + this.Chart.width) / this.Grid.width),
				end = this.Rates[iEnd],
				min = start.Low,
				max = start.High;

			for (let i = iStart; i <= iEnd; i++) {
				if (this.Rates[i].High > max)
					max = this.Rates[i].High;

				if (this.Rates[i].Low < min)
					min = this.Rates[i].Low;
			}

			let scale = (this.Max - this.Min) / (max - min),
				rangeY = (max - min) / (this.Max - this.Min) * this.Chart.height,
				topY = (this.Max - max) / (this.Max - this.Min) * this.Chart.height;

			this.svg.nativeElement.style.transform = "scaleY(" + scale + ") translateY(-" + topY + "px)";

			this.CalcRateGrid.emit({min: min, max: max});
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if (!changes.Rates.firstChange) {
			this.svg.nativeElement.innerHTML = "";

			if (this.Rates.length)
				this.drawChart();
		}
	}
}