import { Pipe, PipeTransform } from '@angular/core';
import moment, { Moment } from 'moment';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';

@Pipe({
	name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
	public transform(date: string | Moment | undefined | null, format: string = SPD_CONSTANTS.date.dateFormat): string {
		return date ? moment(date).format(format) : '';
	}
}
