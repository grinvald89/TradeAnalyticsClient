import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { IPair } from './i-pair';
import { IRate } from './i-rate';

@Injectable()
export class DataService {
	private url: string = "http://127.0.0.1:8080/api/";
	private headers = new Headers();

	constructor(private http: Http) { }

	getPairs(): Observable<IPair[]> {
		let options = new RequestOptions({ headers: this.headers });

		return this.http.get(this.url + "getPairs/", options)
			.map(res => res.json() as IPair[]);
	}

	getRates(take: number, pairid: number, minutes: number, date?: string, isforward?: boolean): Observable<IRate[]> {
		let options = new RequestOptions({ headers: this.headers });

		return this.http.get(this.url + "getRates/?take=" + take + "&pairid=" + pairid + "&minutes=" + minutes + (date ? "&date=" + date : "") + (isforward ? "&isforward=true" : ""), options)
			.map(res => res.json() as IRate[]);
	}
}