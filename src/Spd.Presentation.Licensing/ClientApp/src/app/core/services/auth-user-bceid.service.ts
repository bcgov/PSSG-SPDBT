import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BizListResponse, BizUserLoginResponse } from '@app/api/models';
import {
	BizSelectionDialogData,
	BizSelectionModalComponent,
} from '@app/shared/components/biz-selection-modal.component';
import { lastValueFrom } from 'rxjs';
import { LoginService } from 'src/app/api/services';

@Injectable({ providedIn: 'root' })
export class AuthUserBceidService {
	bceidUserProfile: BizUserLoginResponse | null = null;

	constructor(private loginService: LoginService, private dialog: MatDialog) {}

	//----------------------------------------------------------
	// *
	// * get data related to login
	async whoAmIAsync(defaultBizId: string | null | undefined = undefined): Promise<boolean> {
		this.clearUserData();

		const bizsList: Array<BizListResponse> = await lastValueFrom(this.loginService.apiBizsGet());

		if (bizsList.length === 0) {
			return await this.setBizProfile();
		} else if (bizsList.length === 1) {
			return await this.setBizProfile(bizsList[0].bizId!);
		} else {
			if (defaultBizId) {
				const bizIdItem = bizsList.find((biz) => biz.bizId == defaultBizId);
				if (bizIdItem) {
					return await this.setBizProfile(bizIdItem.bizId);
				}
			}

			const biz = await this.bizSelectionAsync(bizsList);
			return await this.setBizProfile(biz.bizId);
		}
	}

	//----------------------------------------------------------
	// *
	// * clear data on logout
	public clearUserData(): void {
		this.bceidUserProfile = null;
	}

	//----------------------------------------------------------
	// *
	// * get the biz profile
	private async setBizProfile(bizId?: string | undefined): Promise<boolean> {
		const resp: BizUserLoginResponse = await lastValueFrom(this.loginService.apiBizLoginGet({ bizId: bizId }));
		if (resp) {
			this.bceidUserProfile = resp;
			return Promise.resolve(true);
		}

		return Promise.resolve(false);
	}

	//----------------------------------------------------------
	// *
	// * let the user pick the biz to use
	private async bizSelectionAsync(bizsList: Array<BizListResponse>): Promise<BizListResponse> {
		const dialogOptions: BizSelectionDialogData = {
			bizsList: bizsList,
		};

		return lastValueFrom(
			this.dialog
				.open(BizSelectionModalComponent, {
					width: '500px',
					data: dialogOptions,
				})
				.afterClosed()
		);
	}
}
