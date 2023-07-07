import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { ScreeningStatusResponse } from 'src/app/shared/components/screening-statuses-common.component';
import { PssoRoutes } from '../psso-routing.module';
import { DelegateManageModalComponent } from './delegate-manage-modal.component';

@Component({
	selector: 'app-screening-statuses',
	template: `
		<app-screening-statuses-common
			[portal]="portal.Psso"
			heading="Screening Statuses"
			(emitManageDelegate)="onManageDelegates($event)"
			(emitVerifyIdentity)="onVerifyIdentity($event)"
		></app-screening-statuses-common>
	`,
	styles: [],
})
export class ScreeningStatusesComponent {
	portal = PortalTypeCode;

	constructor(private dialog: MatDialog, private router: Router) {}

	onManageDelegates(application: ScreeningStatusResponse): void {
		this.dialog.open(DelegateManageModalComponent, {
			width: '800px',
		});
	}

	onVerifyIdentity(application: ScreeningStatusResponse): void {
		this.router.navigateByUrl(PssoRoutes.path(PssoRoutes.IDENTITY_VERIFICATION), {
			state: { caseId: application.applicationNumber },
		});
	}
}
