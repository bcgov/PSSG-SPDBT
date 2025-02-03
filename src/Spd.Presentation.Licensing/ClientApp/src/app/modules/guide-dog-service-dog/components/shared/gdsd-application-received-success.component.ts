import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';

@Component({
	selector: 'app-gdsd-application-received-success',
	template: `
		<app-container>
			<section class="step-section">
				<div class="row">
					<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-6">
								<ng-container *ngIf="isSubmit; else isPartialSaveTitle">
									<h2 class="fs-3 mt-0 mt-md-3">Submission Received</h2>
								</ng-container>
								<ng-template #isPartialSaveTitle>
									<h2 class="fs-3 mt-0 mt-md-3">Application Saved</h2>
								</ng-template>
							</div>
						</div>
						<mat-divider class="mat-divider-main mb-4"></mat-divider>

						<ng-container *ngIf="isSubmit; else isPartialSave">
							<app-alert type="info" icon="info">
								<p>Your application for a Guide Dog or Service Dog Certificate has been received.</p>
								<p>We will contact you if we need more information.</p>
							</app-alert>
						</ng-container>
						<ng-template #isPartialSave>
							<app-alert type="info" icon="info">
								<p>Your application for a criminal record check has been saved.</p>
								<p>Click on the invitation link again to continue working on and submitting your application.</p>
							</app-alert>
						</ng-template>
					</div>
				</div>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<a
							mat-flat-button
							color="primary"
							aria-label="Close and navigate to SPD contact site"
							class="large w-100"
							[href]="contactSpdUrl"
							>Close</a
						>
					</div>
				</div>
			</section>
		</app-container>
	`,
	styles: [],
	standalone: false,
})
export class GdsdApplicationReceivedSuccessComponent implements OnInit {
	contactSpdUrl = SPD_CONSTANTS.urls.contactSpdUrl;
	gdsdModelData: any = {};

	isSubmit: boolean | null = null;

	constructor(
		private commonApplicationService: CommonApplicationService,
		private gdsdApplicationService: GdsdApplicationService,
		private location: Location
	) {}

	ngOnInit(): void {
		if (!this.gdsdApplicationService.initialized) {
			this.commonApplicationService.onGoToHome();
			return;
		}

		const isSubmit = (this.location.getState() as any).isSubmit;

		if (!isSubmit) {
			console.debug('GdsdApplicationReceivedSuccessComponent - missing isSubmit');
			this.commonApplicationService.onGoToHome();
			return;
		}

		this.isSubmit = isSubmit === BooleanTypeCode.Yes;

		this.gdsdApplicationService.reset();
	}

	onPrint(): void {
		window.print();
	}

	onBackToHome(): void {
		this.commonApplicationService.onGoToHome();
	}
}
