import { Component, Input, SimpleChanges } from '@angular/core';

import { DataService } from '../data.service';
import { TimeService } from '../time.service';

import { IRate } from '../i-rate';
import { IPair } from '../i-pair';

const Params = {
	sizes: {
		grid: {
			height: 50,
			width: 18
		},

		chart: {
			height: 400,
			width: 1835
		}
	},

	request: {
		take: 1000
	}
}

@Component({
	selector: 'app-chart-container',
	templateUrl: './chart-container.component.html',
	styleUrls: ['./chart-container.component.scss']
})

export class ChartContainerComponent {
	@Input() ActivePair: IPair;
	@Input() TimeFrame: number;

	_params = Params;

	// Максимальное количество знаков после запятой, для сетки, считается по High
	digits: number = 0;

	extremes = {
		min: 0,
		max: 0
	};

	rates: IRate[] = [];
	pairs: IPair[] = [];

	rateGrid: number[] = [];

	constructor(
		private dataService: DataService,
		private timeService: TimeService
	) { }

	getRates(take: number, pairid: number, timeFrame: number, date?: string, isforward?: boolean) {
		this.dataService.getRates(take, pairid, this.TimeFrame, date, isforward)
			.subscribe(res => {
				this.digits = 1;
				this.extremes.min = res[0].Low,
				this.extremes.max = res[0].High;

				res.forEach(item => {
					let iDot = item.High.toString().indexOf(".");

					if (iDot != -1 && item.High.toString().substr(iDot + 1).length > this.digits)
						this.digits = item.High.toString().substr(iDot + 1).length;

					if (item.Low < this.extremes.min)
						this.extremes.min = item.Low;

					if (item.High > this.extremes.max)
						this.extremes.max = item.High;
				});

				this.rates = res;
			});
	}

	calcRateGrid(min: number, max: number): void {
		this.rateGrid = [];

		const scaleValue = (max - min) / (Params.sizes.chart.height / Params.sizes.grid.height);

		let value = max,
			i = Params.sizes.chart.height / Params.sizes.grid.height;

		while(i > 0) {
			this.rateGrid.push(Math.round(value * Math.pow(10, this.digits)) / Math.pow(10, this.digits));
			value -= scaleValue;
			i--;
		}

		this.rateGrid.push(min);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if ((changes.ActivePair && !changes.ActivePair.firstChange) || changes.TimeFrame && !changes.TimeFrame.firstChange)
			this.getRates(Params.request.take, this.ActivePair.Id, this.TimeFrame);
	}
}