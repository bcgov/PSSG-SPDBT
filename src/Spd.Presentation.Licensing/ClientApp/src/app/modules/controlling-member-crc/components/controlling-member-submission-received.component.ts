import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
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
								<ng-container *ngIf="isSubmit === booleanYes; else isPartialSaveTitle">
									<h2 class="fs-3 mt-0 mt-md-3">Submission Received</h2>
								</ng-container>
								<ng-template #isPartialSaveTitle>
									<h2 class="fs-3 mt-0 mt-md-3">Application Saved</h2>
								</ng-template>
							</div>

							<!-- <div class="no-print col-6">
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
							</div> -->
						</div>
						<mat-divider class="mat-divider-main mb-4"></mat-divider>

						<ng-container *ngIf="isSubmit === booleanYes; else isPartialSave">
							<app-alert type="info" icon="info">
								Your consent for a criminal record check has been received, and will be added to the business
								application. We will contact you if we need more information.
							</app-alert>
						</ng-container>
						<ng-template #isPartialSave>
							<app-alert type="info" icon="info">
								<p>Your application for a criminal record check has been saved. It has NOT been submitted.</p>
								<p>Click on the invitation link again to continue working on the application.</p>
							</app-alert>
						</ng-template>

						<!-- <div class="my-4 text-center">You can print a copy of this confirmation for your records.</div> -->

						<!-- <div class="no-print d-flex justify-content-end">
							<button
								mat-stroked-button
								color="primary"
								class="large w-auto m-2"
								aria-label="Back"
								(click)="onBackToHome()"
							>
								<mat-icon>arrow_back</mat-icon>Back to Home
							</button>
						</div> -->
					</div>
				</div>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onClose()">Close</button>
					</div>
				</div>
			</section>
		</app-container>
	`,
	styles: [],
})
export class ControllingMemberSubmissionReceivedComponent implements OnInit {
	isSubmit: BooleanTypeCode | null | undefined = null;
	booleanYes = BooleanTypeCode.Yes;

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

		this.controllingMembersService.reset();
	}

	onClose(): void {
		// window.location.assign('http://www.google.ca'); // TODO Submission page close
	}

	onPrint(): void {
		window.print();
	}
}
