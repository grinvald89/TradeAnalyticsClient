import { Injectable } from '@angular/core';

@Injectable()
export class TimeService {
	constructor() { }

	toDateTime(DateTime: string): string {
		let year = DateTime.substr(DateTime.search(/\.[0-9]{4}\s/) + 1, 4),
			mounth = DateTime.substr(DateTime.search(/\.[0-9]{2}\./) + 1, 2),
			day = DateTime.substr(0, DateTime.indexOf("."));

		let sTime = DateTime.substr(DateTime.search(/\s[0-9\:]+$/) + 1),
			hour = sTime.substr(0, sTime.indexOf(":")),
			minute = DateTime.substr(DateTime.search(/\:[0-9]{2}\:/) + 1, 2),
			second = "00.000";

		let checkDigits = (value, count) => {
			let result = value;

			let add = () => {
				result = "0" + result;

				if (result.length < count)
					add();
			}

			if (result.length < count)
				add();

			return result;
		};

		let Result = checkDigits(year, 4) + "-" + checkDigits(mounth, 2) + "-" + checkDigits(day, 2) + "T" + checkDigits(hour, 2) + ":" + checkDigits(minute, 2) + ":" + second;

		return Result;
	}
}