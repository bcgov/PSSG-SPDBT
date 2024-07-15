import { Injectable } from '@angular/core';
import { ApplicantLoginResponse } from '@app/api/models';
import { lastValueFrom } from 'rxjs';
import { LoginService } from 'src/app/api/services';

@Injectable({ providedIn: 'root' })
export class AuthUserBcscService {
	applicantLoginProfile: ApplicantLoginResponse | null = null;

	constructor(private loginService: LoginService) {}

	//----------------------------------------------------------
	// *
	// * get data related to login
	async applicantLoginAsync(): Promise<boolean> {
		this.clearUserData();

		const resp: ApplicantLoginResponse = await lastValueFrom(this.loginService.apiApplicantLoginGet());
		if (resp) {
			this.applicantLoginProfile = resp;
			return Promise.resolve(true);
		}

		return Promise.resolve(false);
	}

	//----------------------------------------------------------
	// *
	// * clear data on logout
	public clearUserData(): void {
		this.applicantLoginProfile = null;
	}
}
