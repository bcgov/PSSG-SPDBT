import { Pipe, PipeTransform } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { format,parse } from 'date-fns';

@Pipe({
    name: 'formatDate',
    standalone: false
})
export class FormatDatePipe implements PipeTransform {
	public transform(date: string | Date | undefined | null, dateFormat: string = SPD_CONSTANTS.date.dateFormat): string {

		if (typeof date == "string" && (/^\d{8}$/.test(date))){
			// date-fns does not accept yyyyMMdd like moment did
			date = parse(date, 'yyyyMMdd', new Date());
		}

		return date ? format(new Date(date), dateFormat) : '';
	}
}
