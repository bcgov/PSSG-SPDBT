import { Pipe } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { MinistryResponse } from 'src/app/api/models';
import { OptionsService } from 'src/app/core/services/options.service';

@Pipe({ name: 'ministryoptions', pure: true })
export class MinistryOptionsPipe {
	constructor(private optionsService: OptionsService) {}

	transform(input: string | undefined, defaultValue: string = ''): Observable<string> {
		if (!input) {
			return of(defaultValue);
		}

		return this.optionsService.getMinistries(true).pipe(
			map((resp: Array<MinistryResponse>) => {
				return resp.find((item) => item.id == input)?.name ?? defaultValue;
			})
		);
	}
}
