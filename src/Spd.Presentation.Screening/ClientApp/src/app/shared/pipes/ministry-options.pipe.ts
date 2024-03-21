import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MinistryResponse } from 'src/app/api/models';
import { OptionsService } from 'src/app/core/services/options.service';

@Pipe({ name: 'ministryoptions', pure: true })
export class MinistryOptionsPipe implements PipeTransform {
	constructor(private optionsService: OptionsService) {}

	transform(input: string | undefined, defaultValue = ''): Observable<string> {
		if (!input) {
			return of(defaultValue);
		}

		return of(
			this.optionsService.getMinistries(true).find((item: MinistryResponse) => item.id == input)?.name ?? defaultValue
		);
	}
}
