import { Injectable } from '@angular/core';
import { ApplicantLoginResponse } from '@app/api/models';
import { lastValueFrom } from 'rxjs';
import { LoginService } from 'src/app/api/services';

@Injectable({ providedIn: 'root' })
export class AuthUserBceidService {
	bceidUserProfile: ApplicantLoginResponse | null = null;

	constructor(private loginService: LoginService) {}

	async whoAmIAsync(): Promise<boolean> {
		this.clearUserData();

		const resp: ApplicantLoginResponse = await lastValueFrom(this.loginService.apiApplicantLoginGet());
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
