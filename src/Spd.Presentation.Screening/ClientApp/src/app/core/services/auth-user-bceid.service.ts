import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { OrgService, UserProfileService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import {
	OrgSelectionDialogData,
	OrgSelectionModalComponent,
} from 'src/app/shared/components/org-selection-modal.component';
import {
	IdentityProviderTypeCode,
	OrgResponse,
	OrgUserProfileResponse,
	UserInfo,
} from '../code-types/code-types.models';

export interface BceidOrgResponse extends OrgResponse {
	isNotVolunteerOrg: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthUserBceidService {
	loginType: IdentityProviderTypeCode | null = null;
	isAllowedGenericUpload: boolean = false;

	bceidUserOrgProfile: BceidOrgResponse | null = null;
	bceidUserInfoProfile: UserInfo | null = null;

	constructor(
		private router: Router,
		private userProfileService: UserProfileService,
		private orgService: OrgService,
		private dialog: MatDialog
	) {}

	//----------------------------------------------------------
	// *
	// *
	async setUserOrgProfile(): Promise<boolean> {
		if (!this.bceidUserInfoProfile) {
			this.bceidUserOrgProfile = null;
			return Promise.resolve(false);
		}

		const bceidUserOrgProfile = await lastValueFrom(
			this.orgService.apiOrgsOrgIdGet({ orgId: this.bceidUserInfoProfile.orgId! })
		);
		this.bceidUserOrgProfile = {
			...bceidUserOrgProfile,
			isNotVolunteerOrg: bceidUserOrgProfile.volunteerOrganizationTypeCode ? false : true,
		};

		console.debug('[AuthUserBceidService] setUserOrgProfile bceidUserOrgProfile', this.bceidUserOrgProfile);
		return Promise.resolve(true);
	}

	//----------------------------------------------------------
	// *
	// *
	async whoAmIAsync(defaultOrgId: string | null = null): Promise<boolean> {
		this.clearUserData();

		const resp: OrgUserProfileResponse = await lastValueFrom(this.userProfileService.apiUsersWhoamiGet());

		if (resp) {
			const uniqueUserInfoList = [
				...new Map(resp.userInfos?.filter((info) => info.orgName).map((item) => [item['orgName'], item])).values(), // remove if no Org Name
			];

			if (uniqueUserInfoList.length == 0) {
				console.error('User does not have any organizations');
				return Promise.resolve(false);
			} else {
				let isSuccess = false;
				if (defaultOrgId) {
					const orgIdItem = uniqueUserInfoList.find((user) => user.orgId == defaultOrgId);
					if (orgIdItem) {
						isSuccess = await this.setUserInfoProfile(orgIdItem);
						return Promise.resolve(isSuccess);
					}
				}

				if (uniqueUserInfoList.length > 1) {
					const result = await this.orgSelectionAsync(uniqueUserInfoList);
					isSuccess = await this.setUserInfoProfile(result);
				} else {
					isSuccess = await this.setUserInfoProfile(uniqueUserInfoList[0]);
				}
				return Promise.resolve(isSuccess);
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
		this.isAllowedGenericUpload = false;
	}

	//----------------------------------------------------------
	// *
	// *
	private async setUserInfoProfile(bceidUserInfoProfile: UserInfo | null = null): Promise<boolean> {
		console.debug('[AuthUserBceidService] bceidUserInfoProfile', bceidUserInfoProfile);

		if (!bceidUserInfoProfile) {
			this.bceidUserInfoProfile = null;
			this.isAllowedGenericUpload = false;
			return Promise.resolve(false);
		}

		this.bceidUserInfoProfile = bceidUserInfoProfile;
		this.isAllowedGenericUpload = bceidUserInfoProfile.orgSettings?.genericUploadEnabled ?? false;

		const userInfoMsgType = this.bceidUserInfoProfile?.userInfoMsgType;
		// Access is denied if there is a userInfoMsgType or there is no orgId
		if (userInfoMsgType || !this.bceidUserInfoProfile?.orgId) {
			console.debug('setUserInfoProfile - userInfoMsgType', userInfoMsgType);
			this.router.navigate([AppRoutes.ACCESS_DENIED], { state: { userInfoMsgType: userInfoMsgType } });
			return Promise.resolve(false);
		}

		return this.setUserOrgProfile();
	}

	//----------------------------------------------------------
	// *
	// *
	private async orgSelectionAsync(userInfos: Array<UserInfo>): Promise<any> {
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
