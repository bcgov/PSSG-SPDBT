import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { ScreeningStatusResponse } from 'src/app/shared/components/screening-statuses-common.component';
import { DelegateManageModalComponent } from './delegate-manage-modal.component';

@Component({
	selector: 'app-screening-statuses',
	template: `
		<app-screening-statuses-common
			[portal]="portal.Psso"
			title="Screening Statuses"
			(emitManageDelegate)="onManageDelegates($event)"
		></app-screening-statuses-common>
	`,
	styles: [],
})
export class ScreeningStatusesComponent {
	portal = PortalTypeCode;

	constructor(private dialog: MatDialog) {}

	onManageDelegates(application: ScreeningStatusResponse): void {
		this.dialog.open(DelegateManageModalComponent, {
			width: '800px',
		});
	}
}
