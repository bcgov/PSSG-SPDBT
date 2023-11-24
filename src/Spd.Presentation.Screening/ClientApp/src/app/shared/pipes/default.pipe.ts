import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'default',
})
export class DefaultPipe implements PipeTransform {
	public transform(value: any, defaultValue = '--'): any {
		if (typeof value === 'string') {
			value = value.trim();
		}
		return value ? value : defaultValue;
	}
}
