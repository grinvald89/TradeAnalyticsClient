import { Component, OnInit, ViewChild } from '@angular/core';

import { DataService } from './data.service';

import { IPair } from './i-pair';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
	pairs: IPair[] = [];
	activePair: IPair;

	timeFrames: number[] = [1, 5, 10, 15, 30, 60];
	timeFrame: number = this.timeFrames[0];

	constructor(private dataService: DataService) { }

	ngOnInit() {
		this.dataService.getPairs()
			.subscribe(res => {
				this.activePair = res[0];
				this.pairs = res;
			});
	}
}