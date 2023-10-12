import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/app-routing.module';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { AuthUserIdirService } from 'src/app/core/services/auth-user-idir.service';
import { ScreeningStatusResponse } from 'src/app/shared/components/screening-statuses-common.component';
import { PssoRoutes } from '../psso-routing.module';
import { DelegateManageDialogData, DelegateManageModalComponent } from './delegate-manage-modal.component';

@Component({
	selector: 'app-screening-statuses',
	template: `
		<app-psso-header></app-psso-header>

		<app-screening-statuses-common
			[portal]="portal.Psso"
			[isPsaUser]="isPsaUser"
			[orgId]="orgId"
			[userId]="userId"
			heading="Screening Statuses"
			(emitManageDelegate)="onManageDelegates($event)"
			(emitVerifyIdentity)="onVerifyIdentity($event)"
		></app-screening-statuses-common>
	`,
	styles: [],
})
export class ScreeningStatusesComponent implements OnInit {
	orgId: string | null = null;
	userId: string | null = null;
	portal = PortalTypeCode;
	isPsaUser: boolean | undefined = this.authUserService.idirUserWhoamiProfile?.isPSA;

	constructor(private dialog: MatDialog, private router: Router, private authUserService: AuthUserIdirService) {}

	ngOnInit(): void {
		const orgId = this.authUserService.idirUserWhoamiProfile?.orgId;
		if (!orgId) {
			console.debug('ScreeningStatusesComponent - missing orgId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.orgId = orgId;
		this.userId = this.authUserService.idirUserWhoamiProfile?.userId!;
	}

	onManageDelegates(application: ScreeningStatusResponse): void {
		const dialogOptions: DelegateManageDialogData = {
			application: application,
		};

		this.dialog.open(DelegateManageModalComponent, {
			width: '800px',
			data: dialogOptions,
		});
	}

	onVerifyIdentity(application: ScreeningStatusResponse): void {
		this.router.navigateByUrl(PssoRoutes.path(PssoRoutes.IDENTITY_VERIFICATION), {
			state: { caseId: application.applicationNumber },
		});
	}
}
