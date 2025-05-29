import { Pipe, PipeTransform } from '@angular/core';
import moment, { Moment } from 'moment';
import { SPD_LIBRARY_CONSTANTS } from './spd-library-constants';

@Pipe({
  name: 'formatDate',
  standalone: false,
})
export class SpdLibraryFormatDatePipe implements PipeTransform {
  public transform(
    date: string | Moment | undefined | null,
    format: string = SPD_LIBRARY_CONSTANTS.date.dateFormat
  ): string {
    return date ? moment(date).format(format) : '';
  }
}
