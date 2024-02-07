import { Component, Input } from '@angular/core';
import { ApplicationTypeCode, PaymentResponse } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

@Component({
	selector: 'app-common-update-received-success',
	template: `
		<div class="row">
			<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
				<div class="row">
					<div class="col-6">
						<h2 class="fs-3 mt-0 mt-md-3">Update Received</h2>
					</div>

					<div class="no-print col-6">
						<div class="d-flex justify-content-end">
							<button mat-flat-button color="primary" class="large w-auto m-2" aria-label="Print" (click)="onPrint()">
								<mat-icon class="d-none d-md-block">print</mat-icon>Print
							</button>
						</div>
					</div>
				</div>
				<mat-divider class="mat-divider-main mb-3"></mat-divider>

				<div class="row mt-4">
					<div class="text-center fs-5">Your update to your Security Worker Licence has been received.</div>

					<div class="mt-4">
						<app-alert type="info" [showBorder]="false" icon="">
							We will contact you if we need more information.
						</app-alert>
					</div>
				</div>

				<div class="row mb-3">
					<div class="col-md-6 col-sm-12 mt-2">
						<div class="d-block text-label text-md-end">Licence Term</div>
					</div>
					<div class="col-md-6 col-sm-12 mt-md-2">
						<div class="payment__text">{{ application?.licenceTermCode | options : 'LicenceTermTypes' }}</div>
					</div>
					<div class="col-md-6 col-sm-12 mt-2">
						<div class="d-block text-label text-md-end">Update fee</div>
					</div>
					<div class="col-md-6 col-sm-12 mt-md-2">
						<div class="payment__text">{{ 0 | currency : 'CAD' : 'symbol-narrow' : '1.0' }}</div>
					</div>
					<div class="col-md-6 col-sm-12 mt-2">
						<div class="d-block text-label text-md-end">Case ID</div>
					</div>
					<div class="col-md-6 col-sm-12 mt-md-2">
						<div class="payment__text">{{ application?.caseNumber }}</div>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			@media print {
				.no-print,
				.no-print * {
					display: none !important;
				}

				.print-only {
					display: block;
				}
			}
		`,
	],
})
export class CommonUpdateReceivedSuccessComponent {
	isBackRoute = false;
	appConstants = SPD_CONSTANTS;
	applicationTypeCodes = ApplicationTypeCode;

	@Input() application: PaymentResponse | null = null;

	onPrint(): void {
		window.print();
	}
}
