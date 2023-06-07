import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScreeningStatusResponse } from 'src/app/shared/components/screening-statuses-common.component';
import { DelegateManageModalComponent } from './delegate-manage-modal.component';

@Component({
	selector: 'app-screening-statuses',
	template: `
		<app-screening-statuses-common
			portal="PSSO"
			title="Screening Statuses"
			(emitManageDelegate)="onManageDelegates($event)"
		></app-screening-statuses-common>
	`,
	styles: [],
})
export class ScreeningStatusesComponent {
	constructor(private dialog: MatDialog) {}

	onManageDelegates(application: ScreeningStatusResponse): void {
		this.dialog.open(DelegateManageModalComponent, {
			width: '800px',
		});
	}
}
