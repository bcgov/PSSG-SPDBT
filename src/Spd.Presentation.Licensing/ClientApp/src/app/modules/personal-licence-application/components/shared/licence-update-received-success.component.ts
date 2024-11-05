import { Component, OnInit } from '@angular/core';
import { LicenceTermCode, ServiceTypeCode } from '@app/api/models';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-licence-update-received-success',
	template: `
		<app-container>
			<section class="step-section">
				<div class="row">
					<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-6">
								<h2 class="fs-3 mt-0 mt-md-3">Update Received</h2>
							</div>

							<div class="no-print col-6">
								<div class="d-flex justify-content-end">
									<button
										mat-flat-button
										color="primary"
										class="large w-auto m-2"
										aria-label="Print"
										(click)="onPrint()"
									>
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
								<div class="d-block payment__text-label text-md-end">Licence Number</div>
							</div>
							<div class="col-md-6 col-sm-12 mt-md-2">
								<div class="payment__text">{{ licenceNumber }}</div>
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
		</app-container>
	`,
	styles: [],
})
export class LicenceUpdateReceivedSuccessComponent implements OnInit {
	licenceModelData: any = {};

	constructor(
		private workerApplicationService: WorkerApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.licenceModelData = { ...this.workerApplicationService.workerModelFormGroup.getRawValue() };

		if (!this.workerApplicationService.initialized) {
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
		return this.workerApplicationService.getSummaryserviceTypeCode(this.licenceModelData);
	}
	get licenceTermCode(): LicenceTermCode | null {
		return this.workerApplicationService.getSummarylicenceTermCode(this.licenceModelData);
	}
	get licenceNumber(): string {
		return this.workerApplicationService.getSummaryoriginalLicenceNumber(this.licenceModelData);
	}
}
