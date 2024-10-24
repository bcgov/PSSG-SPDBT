import { Component, OnInit } from '@angular/core';
import { LicenceTermCode, ServiceTypeCode } from '@app/api/models';
import { ApplicationService } from '@app/core/services/application.service';
import { BusinessApplicationService } from '@app/core/services/business-application.service';

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
						Your update to your {{ serviceTypeCode | options: 'ServiceTypes' }} has been received.
					</div>

					<div class="my-4 text-center">We will contact you if we need more information.</div>

					<div class="row mb-3">
						<div class="col-md-6 col-sm-12 mt-2">
							<div class="d-block payment__text-label text-md-end">Licence Term</div>
						</div>
						<div class="col-md-6 col-sm-12 mt-md-2">
							<div class="payment__text">{{ licenceTermCode | options: 'LicenceTermTypes' }}</div>
						</div>
						<div class="col-md-6 col-sm-12 mt-2">
							<div class="d-block payment__text-label text-md-end">Update Fee</div>
						</div>
						<div class="col-md-6 col-sm-12 mt-md-2">
							<div class="payment__text">{{ 0 | currency: 'CAD' : 'symbol-narrow' : '1.0' }}</div>
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
	styles: [],
})
export class BusinessLicenceUpdateReceivedSuccessComponent implements OnInit {
	businessModelData: any = {};

	constructor(
		private businessApplicationService: BusinessApplicationService,
		private commonApplicationService: ApplicationService
	) {}

	ngOnInit(): void {
		this.businessModelData = { ...this.businessApplicationService.businessModelFormGroup.getRawValue() };

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

	get serviceTypeCode(): ServiceTypeCode | null {
		return this.businessApplicationService.getSummaryserviceTypeCode(this.businessModelData);
	}
	get licenceTermCode(): LicenceTermCode | null {
		return this.businessApplicationService.getSummarylicenceTermCode(this.businessModelData);
	}
	get caseNumber(): string {
		return this.businessApplicationService.getSummarycaseNumber(this.businessModelData);
	}
}
