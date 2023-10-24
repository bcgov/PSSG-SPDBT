import { Injectable } from '@angular/core';
import { UserProfileService } from 'src/app/api/services';
import { ApplicantProfileResponse } from '../api/models';

@Injectable({ providedIn: 'root' })
export class AuthUserBcscService {
	bcscUserWhoamiProfile: ApplicantProfileResponse | null = null;
	bcscUserInfoProfile = null; //TODO: ApplicantUserInfo | null = null;

	constructor(private userProfileService: UserProfileService) {}

	async applicantUserInfoAsync(): Promise<boolean> {
		// this.bcscUserInfoProfile = await lastValueFrom(this.applicantService.apiApplicantsUserinfoGet());
		return Promise.resolve(true);
	}

	async whoAmIAsync(): Promise<boolean> {
		this.clearUserData();

		// const resp: ApplicantProfileResponse = await lastValueFrom(this.userProfileService.apiApplicantsWhoamiGet());

		// if (resp) {
		// 	this.bcscUserWhoamiProfile = resp;
		// 	return Promise.resolve(true);
		// }

		return Promise.resolve(false);
	}

	public clearUserData(): void {
		this.bcscUserWhoamiProfile = null;
		this.bcscUserInfoProfile = null;
	}
}
