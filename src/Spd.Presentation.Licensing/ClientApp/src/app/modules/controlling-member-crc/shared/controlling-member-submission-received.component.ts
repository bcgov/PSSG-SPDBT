import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
								<h2 class="fs-3 mt-0 mt-md-3">Submission Received</h2>
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
						<mat-divider class="mat-divider-main mb-4"></mat-divider>

						<app-alert type="info" icon="info">
							Your consent for a criminal record check has been received, and will be added to the business application.
							We will contact you if we need more information.
						</app-alert>

						<div class="row my-4">
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

						<div class="my-4 text-center">You can print a copy of this confirmation for your records.</div>

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
export class ControllingMemberSubmissionReceivedComponent {
	constructor(private router: Router) {}

	onBackToHome(): void {
		this.router.navigateByUrl(ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_LOGIN));
	}

	onPrint(): void {
		window.print();
	}

	get caseNumber(): string {
		return '???'; // TODO this.controllingMembersModelData.caseNumber ?? '';
	}
}
