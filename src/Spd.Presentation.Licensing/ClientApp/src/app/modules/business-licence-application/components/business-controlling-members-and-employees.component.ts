import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';

@Component({
	selector: 'app-business-controlling-members-and-employees',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-8 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">{{ title }}</h2>
						</div>

						<div class="col-xl-4 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								<button
									mat-stroked-button
									color="primary"
									class="large w-auto mb-3"
									aria-label="Back"
									(click)="onCancel()"
								>
									<mat-icon>arrow_back</mat-icon>Back
								</button>
							</div>
						</div>
						<div class="col-12 mb-3">
							<p>
								Your business must have valid security worker licence holders in B.C. that support the various licence
								categories the business wishes to be licensed for. If your controlling members don't meet this
								requirement, add employees who do.
							</p>

							<p>
								If your controlling members or your employees, who are licence holders for the business, change during
								the business licence term, update their information here.
							</p>
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
						<app-common-employees
							[defaultExpanded]="true"
							[isWizard]="false"
							[isReadonly]="isReadonly"
						></app-common-employees>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class BusinessControllingMembersAndEmployeesComponent {
	title = 'Controlling Members & Employees';
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
		this.title = this.isReadonly ? 'View Controlling Members & Employees' : 'Controlling Members & Employees';
	}

	onCancel(): void {
		this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
	}
}
