import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OrgService, UserProfileService } from 'src/app/api/services';
import {
	OrgSelectionDialogData,
	OrgSelectionModalComponent,
} from 'src/app/shared/components/org-selection-modal.component';
import { OrgResponse, UserInfo, UserProfileResponse } from '../code-types/code-types.models';

@Injectable({ providedIn: 'root' })
export class AuthUserService {
	userOrgProfile: OrgResponse | null = null;
	userInfo: UserInfo | null = null;
	genericUploadEnabled: boolean = false;

	constructor(private userService: UserProfileService, private orgService: OrgService, private dialog: MatDialog) {}

	whoAmI(): Observable<UserProfileResponse> {
		return this.userService.apiUserGet().pipe(
			tap((resp: UserProfileResponse) => {
				const userInfosList = resp.userInfos?.filter((info) => info.orgId);
				const userInfos = userInfosList ? userInfosList : [];

				if (userInfos.length == 0) {
					console.error('User does not have any organizations');
				} else if (userInfos.length > 1) {
					this.orgSelection(userInfos);
				} else {
					this.setOrgProfile(userInfos[0]);
				}
			})
		);
	}

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

	async setOrgSelection(): Promise<boolean> {
		const resp: UserProfileResponse = await lastValueFrom(this.userService.apiUserGet());

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

		console.error('No user response');
		return Promise.resolve(false);
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

	private orgSelection(userInfos: Array<UserInfo>): void {
		const dialogOptions: OrgSelectionDialogData = {
			userInfos: userInfos,
		};

		this.dialog
			.open(OrgSelectionModalComponent, {
				width: '500px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((res: UserInfo) => {
				if (res) {
					this.setOrgProfile(res);
				}
			});
	}
}
