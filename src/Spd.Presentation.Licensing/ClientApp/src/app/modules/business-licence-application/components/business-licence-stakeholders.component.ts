import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';

@Component({
	selector: 'app-business-licence-stakeholders',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-9 col-lg-10 col-md-12 my-auto">
							<h2 class="fs-3">{{ title }}</h2>
						</div>

						<div class="col-xl-3 col-lg-2 col-md-12">
							<div class="d-flex justify-content-end">
								<button
									mat-stroked-button
									color="primary"
									class="large w-auto mb-3"
									aria-label="Back to main page"
									(click)="onCancel()"
								>
									<mat-icon>arrow_back</mat-icon>Back
								</button>
							</div>
						</div>
						<div class="col-xl-11 col-lg-12 mb-3">
							<ul class="m-0">
								<li class="mb-2">
									Your business must disclose all controlling members. A controlling member is an individual with
									decision-making authority that allows them to direct the operations of the business.
								</li>
								<li class="mb-2">
									Your business must have a manager who is at least 19, and who is responsible for the day-to-day
									supervision of your licensed security workers.
								</li>
								<li class="mb-2">
									Your business is required to have valid security licence holders in B.C. for each applicable licence
									category. If your current controlling members do not meet these requirements, add employees who do.
								</li>
								<li>
									If the licence holders, controlling members, or managers associated with your business change during
									the business licence term, update the information here.
								</li>
							</ul>
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<app-common-controlling-members
						[defaultExpanded]="true"
						[isWizard]="false"
						[isApplDraftOrWaitingForPayment]="isApplDraftOrWaitingForPayment"
						[isApplExists]="isApplExists"
						[isLicenceExists]="isLicenceExists"
						[isReadonly]="isReadonly"
					></app-common-controlling-members>

					<div class="mt-3">
						<app-common-business-members
							[defaultExpanded]="true"
							[isWizard]="false"
							[isApplDraftOrWaitingForPayment]="isApplDraftOrWaitingForPayment"
							[isApplExists]="isApplExists"
							[isLicenceExists]="isLicenceExists"
							[isReadonly]="isReadonly"
						></app-common-business-members>
					</div>

					<div class="mt-3">
						<app-common-employees [defaultExpanded]="true" [isReadonly]="isReadonly"></app-common-employees>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
	standalone: false,
})
export class BusinessLicenceStakeholdersComponent {
	title = 'Controlling Members, Business Managers & Employees';
	isApplExists!: boolean;
	isLicenceExists!: boolean;
	isApplDraftOrWaitingForPayment!: boolean;
	isReadonly!: boolean;

	constructor(private router: Router) {
		const state = this.router.getCurrentNavigation()?.extras.state;

		this.isApplExists = state ? state['isApplExists'] : false;
		this.isApplDraftOrWaitingForPayment = state ? state['isApplDraftOrWaitingForPayment'] : false;
		this.isLicenceExists = state ? state['isLicenceExists'] : false;

		this.isReadonly = this.isApplExists && !this.isApplDraftOrWaitingForPayment;
		this.title = this.isReadonly
			? 'View Controlling Members, Business Managers & Employees'
			: 'Controlling Members, Business Managers & Employees';
	}

	onCancel(): void {
		this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
	}
}
