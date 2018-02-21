import { Component, ViewChild } from '@angular/core';

interface iChart {
	value: number;
	minute: number;

	minutePX?: number;
};

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {
	rates: iChart[] = [
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
}
