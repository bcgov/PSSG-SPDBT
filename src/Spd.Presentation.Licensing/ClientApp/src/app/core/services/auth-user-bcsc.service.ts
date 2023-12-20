import { Injectable } from '@angular/core';
import { ApplicantProfileResponse } from '@app/api/models';
import { lastValueFrom } from 'rxjs';
import { UserProfileService } from 'src/app/api/services';

@Injectable({ providedIn: 'root' })
export class AuthUserBcscService {
	bcscUserWhoamiProfile: ApplicantProfileResponse | null = null;

	constructor(private userProfileService: UserProfileService) {}

	async whoAmIAsync(): Promise<boolean> {
		this.clearUserData();

		const resp: ApplicantProfileResponse = await lastValueFrom(this.userProfileService.apiSecurityWorkerWhoamiGet());
		if (resp) {
			this.bcscUserWhoamiProfile = resp;
			return Promise.resolve(true);
		}

		return Promise.resolve(false);
	}

	public clearUserData(): void {
		this.bcscUserWhoamiProfile = null;
	}
}
