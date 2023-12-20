import { Injectable } from '@angular/core';
import { OrgUserProfileResponse } from '@app/api/models';
import { lastValueFrom } from 'rxjs';
import { UserProfileService } from 'src/app/api/services';

@Injectable({ providedIn: 'root' })
export class AuthUserBceidService {
	bceidUserProfile: OrgUserProfileResponse | null = null;

	constructor(private userProfileService: UserProfileService) {}

	async whoAmIAsync(): Promise<boolean> {
		this.clearUserData();

		const resp: OrgUserProfileResponse = await lastValueFrom(this.userProfileService.apiBizLicenceWhoamiGet());
		if (resp) {
			this.bceidUserProfile = resp;
			return Promise.resolve(true);
		}

		return Promise.resolve(false);
	}

	public clearUserData(): void {
		this.bceidUserProfile = null;
	}
}
