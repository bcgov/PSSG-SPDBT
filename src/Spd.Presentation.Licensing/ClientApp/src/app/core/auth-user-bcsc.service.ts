import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApplicantService, UserProfileService } from 'src/app/api/services';
import { ApplicantProfileResponse, ApplicantUserInfo } from '../api/models';

@Injectable({ providedIn: 'root' })
export class AuthUserBcscService {
	bcscUserWhoamiProfile: ApplicantProfileResponse | null = null;
	bcscUserInfoProfile: ApplicantUserInfo | null = null;

	constructor(private userProfileService: UserProfileService, private applicantService: ApplicantService) {}

	async applicantUserInfoAsync(): Promise<boolean> {
		this.bcscUserInfoProfile = await lastValueFrom(this.applicantService.apiApplicantsUserinfoGet());
		return Promise.resolve(true);
	}

	async whoAmIAsync(): Promise<boolean> {
		this.clearUserData();

		const resp: ApplicantProfileResponse = await lastValueFrom(this.userProfileService.apiApplicantsWhoamiGet());

		if (resp) {
			this.bcscUserWhoamiProfile = resp;
			return Promise.resolve(true);
		}

		return Promise.resolve(false);
	}

	public clearUserData(): void {
		this.bcscUserWhoamiProfile = null;
		this.bcscUserInfoProfile = null;
	}
}
