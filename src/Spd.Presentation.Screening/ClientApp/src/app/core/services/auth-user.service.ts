import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { ApplicantService, OrgService, UserProfileService } from 'src/app/api/services';
import {
	OrgSelectionDialogData,
	OrgSelectionModalComponent,
} from 'src/app/shared/components/org-selection-modal.component';
import {
	ApplicantProfileResponse,
	ApplicantUserInfo,
	IdentityProviderTypeCode,
	OrgResponse,
	UserInfo,
	UserProfileResponse,
} from '../code-types/code-types.models';

@Injectable({ providedIn: 'root' })
export class AuthUserService {
	loginType: IdentityProviderTypeCode | null = null;
	isAllowedGenericUpload: boolean = false;

	bcscUserWhoamiProfile: ApplicantProfileResponse | null = null;
	bcscUserInfoProfile: ApplicantUserInfo | null = null;

	bceidUserOrgProfile: OrgResponse | null = null;
	bceidUserInfoProfile: UserInfo | null = null;

	constructor(
		private userProfileService: UserProfileService,
		private applicantService: ApplicantService,
		private orgService: OrgService,
		private dialog: MatDialog
	) {}

	//----------------------------------------------------------
	// *
	// *
	setOrgProfile(bceidUserInfoProfile: UserInfo | null = null): void {
		console.debug('[AuthUserService] bceidUserInfoProfile', bceidUserInfoProfile);

		if (!bceidUserInfoProfile) {
			this.bceidUserInfoProfile = null;
			this.isAllowedGenericUpload = false;
			return;
		}

		this.bceidUserInfoProfile = bceidUserInfoProfile;
		this.isAllowedGenericUpload = bceidUserInfoProfile.orgSettings?.genericUploadEnabled ?? false;

		this.updateOrgProfile();
	}

	//----------------------------------------------------------
	// *
	// *
	updateOrgProfile(): void {
		if (!this.bceidUserInfoProfile) {
			this.bceidUserOrgProfile = null;
			return;
		}

		this.orgService
			.apiOrgsOrgIdGet({ orgId: this.bceidUserInfoProfile.orgId! })
			.pipe()
			.subscribe((resp: OrgResponse) => {
				this.bceidUserOrgProfile = resp;
				console.debug('[AuthUserService] setOrgProfile', resp);
			});
	}

	//----------------------------------------------------------
	// *
	// *
	async applicantUserInfoAsync(): Promise<boolean> {
		this.loginType = IdentityProviderTypeCode.BcServicesCard;
		this.bcscUserInfoProfile = await lastValueFrom(this.applicantService.apiApplicantsUserinfoGet());
		return Promise.resolve(true);
	}

	//----------------------------------------------------------
	// *
	// *
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
				this.bcscUserWhoamiProfile = resp;
				return Promise.resolve(true);
			}
		}

		return Promise.resolve(false);
	}

	//----------------------------------------------------------
	// *
	// *
	public clearUserData(): void {
		this.bceidUserInfoProfile = null;
		this.bceidUserOrgProfile = null;
		this.bcscUserWhoamiProfile = null;
		this.bcscUserInfoProfile = null;
		this.isAllowedGenericUpload = false;
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
