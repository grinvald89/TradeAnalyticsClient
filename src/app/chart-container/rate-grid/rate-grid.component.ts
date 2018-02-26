import { Component, Input, OnInit, SimpleChanges, ViewChild, ElementRef } from '@angular/core';

@Component({
	selector: 'app-rate-grid',
	templateUrl: './rate-grid.component.html',
	styleUrls: ['./rate-grid.component.scss']
})

export class RateGridComponent implements OnInit {
	@Input() Rates: number[];

	@Input() Chart: { width: number; height: number; };
	@Input() Grid: { width: number; height: number; };

	@ViewChild("svg") svg: ElementRef;

	constructor() { }

	ngOnInit() {
		for (let i = 0; i <= Math.floor(this.Chart.height / this.Grid.height); i++) {
			let newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
			newLine.setAttribute("x1", "0");
			newLine.setAttribute("y1", (i * this.Grid.height).toString());
			newLine.setAttribute("x2", (this.Chart.width + 8).toString());
			newLine.setAttribute("y2", (i * this.Grid.height).toString());
			newLine.setAttribute("stroke", "#000");
			newLine.setAttribute("stroke-width", "0.1");

			this.svg.nativeElement.appendChild(newLine);
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		console.log(changes);
	}
}