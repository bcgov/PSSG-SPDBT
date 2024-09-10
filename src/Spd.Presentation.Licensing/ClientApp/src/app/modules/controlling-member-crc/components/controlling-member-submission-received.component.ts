import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { ControllingMemberCrcRoutes } from '@app/modules/controlling-member-crc/controlling-member-crc-routing.module';

@Component({
	selector: 'app-controlling-member-submission-received',
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
								<p>
									Your consent for a criminal record check has been received, and will be added to the business
									application.
								</p>
								<p>We will contact you if we need more information.</p>
							</app-alert>
						</ng-container>
						<ng-template #isPartialSave>
							<app-alert type="info" icon="info">
								<p>Your application for a criminal record check has been saved.</p>
								<p>Click on the invitation link again to continue working on and submitting the application.</p>
							</app-alert>
						</ng-template>
					</div>
				</div>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<a mat-flat-button color="primary" class="large w-100" [href]="constants.urls.contactSpdUrl">Close</a>
					</div>
				</div>
			</section>
		</app-container>
	`,
	styles: [],
})
export class ControllingMemberSubmissionReceivedComponent implements OnInit {
	constants = SPD_CONSTANTS;
	isSubmit: boolean | null = null;

	constructor(
		private router: Router,
		private controllingMembersService: ControllingMemberCrcService,
		private location: Location
	) {}

	ngOnInit(): void {
		if (!this.controllingMembersService.initialized) {
			this.router.navigateByUrl(
				ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_INVITATION)
			);
			return;
		}

		const isSubmit = (this.location.getState() as any).isSubmit;

		if (!isSubmit) {
			console.debug('ControllingMemberSubmissionReceivedComponent - missing isSubmit');
			this.router.navigateByUrl(
				ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_INVITATION)
			);
			return;
		}

		this.isSubmit = isSubmit === BooleanTypeCode.Yes;

		this.controllingMembersService.reset();
	}

	onPrint(): void {
		window.print();
	}
}
