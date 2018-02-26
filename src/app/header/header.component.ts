import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { IPair } from '../i-pair';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
	@Input() Pairs: IPair[];
	@Input() ActivePair: IPair;
	@Output() ActivePairChange = new EventEmitter<IPair>();

	@Input() TimeFrames: number[];
	@Input() TimeFrame: number;
	@Output() TimeFrameChange = new EventEmitter<number>();

	_activePair: IPair;

	get activePair() {
		return this._activePair;
	}

	set activePair(value: IPair) {
		this._activePair = value;
		this.ActivePairChange.emit(value);
	}

	_timeFrame: number;

	get timeFrame() {
		return this._timeFrame;
	}

	set timeFrame(value: number) {
		this._timeFrame = value;
		this.TimeFrameChange.emit(value);
	}

	constructor() { }

	ngOnChanges(changes: SimpleChanges) {
		if (changes.ActivePair)
			this.activePair = changes.ActivePair.currentValue;

		if (changes.TimeFrame)
			this.timeFrame = changes.TimeFrame.currentValue;
	}
}