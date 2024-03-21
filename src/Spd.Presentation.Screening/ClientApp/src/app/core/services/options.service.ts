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

	public getMinistries(allMinistries?: boolean): Array<MinistryResponse> {
		if (this.ministries) {
			if (allMinistries) {
				return this.ministries;
			}
			// by default, return only active
			return this.ministries.filter((ministry) => ministry.isActive);
		}

		return [];
	}

	public loadMinistries(allMinistries?: boolean): Observable<Array<MinistryResponse>> {
		if (this.ministries) {
			return of(this.getMinistries(allMinistries));
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
