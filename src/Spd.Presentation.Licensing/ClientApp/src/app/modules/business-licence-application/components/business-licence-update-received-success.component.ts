import { Component, OnInit } from '@angular/core';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/modules/business-licence-application/business-application.service';
import { CommonApplicationService } from '@app/shared/services/common-application.service';

@Component({
	selector: 'app-licence-update-received-success',
	template: `
		<section class="step-section">
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

					<div class="mt-4 text-center fs-5">
						Your update to your {{ workerLicenceTypeCode | options : 'WorkerLicenceTypes' }} has been received.
					</div>

					<div class="my-4 text-center">We will contact you if we need more information.</div>

					<div class="row mb-3">
						<div class="col-md-6 col-sm-12 mt-2">
							<div class="d-block payment__text-label text-md-end">Licence Term</div>
						</div>
						<div class="col-md-6 col-sm-12 mt-md-2">
							<div class="payment__text">{{ licenceTermCode | options : 'LicenceTermTypes' }}</div>
						</div>
						<div class="col-md-6 col-sm-12 mt-2">
							<div class="d-block payment__text-label text-md-end">Update Fee</div>
						</div>
						<div class="col-md-6 col-sm-12 mt-md-2">
							<div class="payment__text">{{ 0 | currency : 'CAD' : 'symbol-narrow' : '1.0' }}</div>
						</div>
						<div class="col-md-6 col-sm-12 mt-2">
							<div class="d-block payment__text-label text-md-end">Case Number</div>
						</div>
						<div class="col-md-6 col-sm-12 mt-md-2">
							<div class="payment__text">{{ caseNumber }}</div>
						</div>
					</div>

					<div class="no-print d-flex justify-content-end">
						<button
							mat-stroked-button
							color="primary"
							class="large w-auto m-2"
							aria-label="Back"
							(click)="onBackToHome()"
						>
							<mat-icon>arrow_back</mat-icon>Back to Home
						</button>
					</div>
				</div>
			</div>
		</section>
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
export class BusinessLicenceUpdateReceivedSuccessComponent implements OnInit {
	licenceModelData: any = {};

	constructor(
		private businessApplicationService: BusinessApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.licenceModelData = { ...this.businessApplicationService.businessModelFormGroup.getRawValue() };

		if (!this.businessApplicationService.initialized) {
			this.commonApplicationService.onGoToHome();
		}
	}

	onPrint(): void {
		window.print();
	}

	onBackToHome(): void {
		this.commonApplicationService.onGoToHome();
	}

	get workerLicenceTypeCode(): WorkerLicenceTypeCode | null {
		return this.licenceModelData.workerLicenceTypeData?.workerLicenceTypeCode ?? null;
	}
	get licenceTermCode(): string {
		return this.licenceModelData.licenceTermData.licenceTermCode ?? '';
	}
	get caseNumber(): string {
		return this.licenceModelData.caseNumber ?? '';
	}
}
