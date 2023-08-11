import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { MinistryService } from 'src/app/api/services';
import { MinistryResponse } from '../code-types/code-types.models';

@Injectable({
	providedIn: 'root',
})
export class OptionsService {
	private ministries: Array<MinistryResponse> | null = null;

	constructor(private ministryService: MinistryService) {}

	public getMinistries(allMinistries?: boolean): Observable<Array<MinistryResponse>> {
		if (this.ministries) {
			if (allMinistries) {
				return of(this.ministries);
			}
			// by default, return only active
			const activeOnly = this.ministries.filter((ministry) => ministry.isActive);
			return of(activeOnly);
		}

		return this.ministryService.apiMinistriesGet().pipe(
			tap((resp: Array<MinistryResponse>) => {
				this.ministries = [...resp];

				if (allMinistries) {
					return resp;
				}

				// by default, return only active
				const activeOnly = resp.filter((ministry) => ministry.isActive);
				return of(activeOnly);
			})
		);
	}
}
