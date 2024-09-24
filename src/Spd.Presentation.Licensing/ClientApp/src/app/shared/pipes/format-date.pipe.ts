import { Pipe, PipeTransform } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import moment from 'moment';
import { Moment } from 'moment';

@Pipe({
	name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
	public transform(date: string | Moment | undefined | null, format: string = SPD_CONSTANTS.date.dateFormat): string {
		return date ? moment(date).format(format) : '';
	}
}
