import { Pipe, PipeTransform } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { format, parse, parseISO } from 'date-fns';

@Pipe({
    name: 'formatDate',
    standalone: false
})
export class FormatDatePipe implements PipeTransform {
	public transform(date: string | Date | undefined | null, dateFormat: string = SPD_CONSTANTS.date.dateFormat): string {
		if (!date) return '';

		if (date instanceof Date) {
			return format(date, dateFormat);
		} else {
			return format(parseISO(date), dateFormat);
		}
	}
}
