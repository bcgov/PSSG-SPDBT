import { Pipe, PipeTransform } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';

@Pipe({
    name: 'formatDate',
    standalone: false
})
export class FormatDatePipe implements PipeTransform {
	public transform(date: string | Date | undefined | null, dateFormat: string = SPD_CONSTANTS.date.dateFormat): string {
		if (!date) return '';

		return format(typeof date === 'string' ? parseISO(date) : date, dateFormat);
	}
}
