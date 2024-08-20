import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ControllingMemberCrcRoutes } from '@app/modules/controlling-member-crc/controlling-member-crc-routing.module';

@Component({
	selector: 'app-controlling-member-submission-received',
	template: `
		<app-container>
			<app-step-section title="Submission Received">
				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<app-alert type="info" icon="info">
							Your consent for a criminal record check has been received, and will be added to the business application.
						</app-alert>
					</div>
				</div>

				<div class="my-4 text-center">We will contact you if we need more information.</div>

				<div class="row mb-3">
					<div class="col-md-6 col-sm-12 mt-2">
						<div class="d-block payment__text-label text-md-end">Case Number</div>
					</div>
					<div class="col-md-6 col-sm-12 mt-md-2">
						<div class="payment__text">{{ caseNumber }}</div>
					</div>
					<div class="col-md-6 col-sm-12 mt-2">
						<div class="d-block payment__text-label text-md-end">Date and Time of Submission</div>
					</div>
					<div class="col-md-6 col-sm-12 mt-md-2">
						<div class="payment__text">???</div>
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
			</app-step-section>
		</app-container>
	`,
	styles: [],
})
export class ControllingMemberSubmissionReceivedComponent {
	constructor(private router: Router) {}

	onBackToHome(): void {
		this.router.navigateByUrl(ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_LOGIN));
	}

	get caseNumber(): string {
		return '???'; // TODO this.controllingMembersModelData.caseNumber ?? '';
	}
}
