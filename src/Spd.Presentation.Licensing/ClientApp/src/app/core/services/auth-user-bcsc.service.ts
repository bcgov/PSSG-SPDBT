import { Injectable } from '@angular/core';
import { ApplicantLoginResponse, ApplicantProfileResponse } from '@app/api/models';
import { lastValueFrom } from 'rxjs';
import { ApplicantProfileService, LoginService } from 'src/app/api/services';

@Injectable({ providedIn: 'root' })
export class AuthUserBcscService {
	applicantLoginProfile: ApplicantLoginResponse | null = null;
	applicantProfile: ApplicantProfileResponse | null = null;

	constructor(private loginService: LoginService, private applicantProfileService: ApplicantProfileService) {}

	async applicantLoginAsync(): Promise<boolean> {
		this.clearUserData();

		const resp: ApplicantLoginResponse = await lastValueFrom(this.loginService.apiApplicantLoginGet());
		if (resp) {
			// resp.isFirstTimeLogin = true; // TODO remove hardcoded
			this.applicantLoginProfile = resp;

			const resp2: ApplicantLoginResponse = await lastValueFrom(
				this.applicantProfileService.apiApplicantIdGet({ id: this.applicantLoginProfile?.applicantId! })
			);
			if (resp2) {
				this.applicantProfile = resp2;
			}

			return Promise.resolve(true);
		}

		return Promise.resolve(false);
	}

	// async applicantProfileAsync(): Promise<boolean> {
	// 	const resp: ApplicantLoginResponse = await lastValueFrom(
	// 		this.applicantProfileService.apiApplicantIdGet({ id: this.applicantLoginProfile?.applicantId! })
	// 	);
	// 	if (resp) {
	// 		this.applicantProfile = resp;
	// 		return Promise.resolve(true);
	// 	}

	// 	return Promise.resolve(false);
	// }

	public clearUserData(): void {
		this.applicantLoginProfile = null;
		this.applicantProfile = null;
	}
}
