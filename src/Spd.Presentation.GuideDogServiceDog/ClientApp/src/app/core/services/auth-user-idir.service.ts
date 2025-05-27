import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { UserProfileService } from 'src/app/api/services';
import { IdirUserProfileResponse } from '../code-types/code-types.models';

@Injectable({ providedIn: 'root' })
export class AuthUserIdirService {
	idirUserWhoamiProfile: IdirUserProfileResponse | null = null;

	constructor(private userProfileService: UserProfileService) {}

	async whoAmIAsync(): Promise<boolean> {
		this.clearUserData();

		const resp: IdirUserProfileResponse = await lastValueFrom(this.userProfileService.apiIdirUsersWhoamiGet());

		if (resp) {
			this.idirUserWhoamiProfile = resp;
			return Promise.resolve(true);
		}

		return Promise.resolve(false);
	}

	public clearUserData(): void {
		this.idirUserWhoamiProfile = null;
	}
}
