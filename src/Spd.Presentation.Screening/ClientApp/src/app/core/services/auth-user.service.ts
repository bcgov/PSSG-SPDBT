import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { OrgService, UserProfileService } from 'src/app/api/services';
import {
	OrgSelectionDialogData,
	OrgSelectionModalComponent,
} from 'src/app/shared/components/org-selection-modal.component';
import {
	ApplicantProfileResponse,
	IdentityProviderTypeCode,
	OrgResponse,
	UserInfo,
	UserProfileResponse,
} from '../code-types/code-types.models';

@Injectable({ providedIn: 'root' })
export class AuthUserService {
	loginType: IdentityProviderTypeCode | null = null;
	userOrgProfile: OrgResponse | null = null;
	applicantProfile: ApplicantProfileResponse | null = null;
	userInfo: UserInfo | null = null;
	genericUploadEnabled: boolean = false;

	constructor(
		private userProfileService: UserProfileService,
		private orgService: OrgService,
		private dialog: MatDialog
	) {}

	setOrgProfile(userInfo: UserInfo | null = null): void {
		console.debug('[AuthUserService] userInfo', userInfo);

		if (!userInfo) {
			this.userInfo = null;
			this.genericUploadEnabled = false;
			return;
		}

		this.userInfo = userInfo;
		this.genericUploadEnabled = userInfo.orgSettings?.genericUploadEnabled ?? false;

		this.updateOrgProfile();
	}

	updateOrgProfile(): void {
		if (!this.userInfo) {
			this.userOrgProfile = null;
			return;
		}

		this.orgService
			.apiOrgsOrgIdGet({ orgId: this.userInfo.orgId! })
			.pipe()
			.subscribe((resp: OrgResponse) => {
				this.userOrgProfile = resp;
				console.debug('[AuthUserService] setOrgProfile', resp);
			});
	}

	async whoAmIAsync(loginType: IdentityProviderTypeCode): Promise<boolean> {
		this.loginType = loginType;
		this.clearUserData();

		if (loginType == IdentityProviderTypeCode.BusinessBceId) {
			const resp: UserProfileResponse = await lastValueFrom(this.userProfileService.apiUsersWhoamiGet());

			if (resp) {
				const uniqueUserInfoList = [
					...new Map(resp.userInfos?.filter((info) => info.orgId).map((item) => [item['orgId'], item])).values(),
				];

				if (uniqueUserInfoList.length == 0) {
					console.error('User does not have any organizations');
					return Promise.resolve(false);
				} else {
					if (uniqueUserInfoList.length > 1) {
						const result = await this.orgSelectionAsync(uniqueUserInfoList);
						this.setOrgProfile(result);
					} else {
						this.setOrgProfile(uniqueUserInfoList[0]);
					}
					return Promise.resolve(true);
				}
			}
		} else if (loginType == IdentityProviderTypeCode.BcServicesCard) {
			const resp: ApplicantProfileResponse = await lastValueFrom(this.userProfileService.apiApplicantsWhoamiGet());

			if (resp) {
				this.applicantProfile = resp;
				return Promise.resolve(true);
			}
		}

		return Promise.resolve(false);
	}

	private clearUserData(): void {
		this.userOrgProfile = null;
		this.applicantProfile = null;
		this.userInfo = null;
		this.genericUploadEnabled = false;
	}

	private orgSelectionAsync(userInfos: Array<UserInfo>): Promise<any> {
		const dialogOptions: OrgSelectionDialogData = {
			userInfos: userInfos,
		};

		return lastValueFrom(
			this.dialog
				.open(OrgSelectionModalComponent, {
					width: '500px',
					data: dialogOptions,
				})
				.afterClosed()
		);
	}
}
