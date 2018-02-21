import { Component, OnInit } from '@angular/core';

import { DataService } from '../../data.service';

@Component({
  selector: 'app-japanese-candlesticks',
  templateUrl: './japanese-candlesticks.component.html',
  styleUrls: ['./japanese-candlesticks.component.scss']
})
export class JapaneseCandlesticksComponent implements OnInit {
	constructor(private dataService: DataService) { }

	ngOnInit() {
		this.dataService.getRates(1000, 1, 1)
			.subscribe(res => console.log(res));
	}
}