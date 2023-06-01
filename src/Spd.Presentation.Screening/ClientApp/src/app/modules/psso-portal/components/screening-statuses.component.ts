import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { DelegateAddModalComponent } from './delegate-add-modal.component';

@Component({
	selector: 'app-screening-statuses',
	template: `
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Screening Statuses</h2>
					<!-- <app-banner></app-banner> -->
				</div>
			</div>

			<app-status-statistics></app-status-statistics>

			<button mat-flat-button color="primary" class="w-auto" (click)="addDelegate()">Add Delegate</button>
		</section>
	`,
	styles: [],
})
export class ScreeningStatusesComponent {
	constructor(private dialog: MatDialog, private hotToast: HotToastService) {}

	addDelegate(): void {
		this.dialog
			.open(DelegateAddModalComponent, {
				width: '800px',
			})
			.afterClosed()
			.subscribe((resp) => {
				if (resp) {
					this.hotToast.success('User was successfully added');
				}
			});
	}
}
