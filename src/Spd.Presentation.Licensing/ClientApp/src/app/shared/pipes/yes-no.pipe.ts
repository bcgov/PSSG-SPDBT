import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'yesNo',
	standalone: false,
})
export class YesNoPipe implements PipeTransform {
	public transform(value: any, explicit = false): string {
		// Null check to allow for default pipe chaining, but allow
		// for an explicit yes or no if required
		return value === null && !explicit ? '' : value ? 'Yes' : 'No';
	}
}
