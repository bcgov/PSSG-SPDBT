import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { BusinessApplicationService } from '../../services/business-application.service';

@Component({
	selector: 'app-step-business-licence-profile',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Business Profile</h2>
						</div>

						<div class="col-xl-6 col-lg-4 col-md-12">
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
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<app-common-business-profile [branchesInBcFormGroup]="branchesInBcFormGroup"></app-common-business-profile>

					<div class="row mt-3">
						<div class="col-12">
							<app-alert type="info" icon="" [showBorder]="false">
								<div class="mb-2">COLLECTION NOTICE</div>
								All information regarding this application is collected under the
								<i>Security Services Act</i> and its Regulation and will be used for that purpose. The use of this
								information will comply with the <i>Freedom of Information</i> and <i>Privacy Act</i> and the federal
								<i>Privacy Act</i>. If you have any questions regarding the collection or use of this information,
								please contact
								<a href="mailto:securitylicensing@gov.bc.ca">securitylicensing&#64;gov.bc.ca</a>
							</app-alert>
						</div>
					</div>
				</div>
			</div>
		</section>

		<div class="row mt-3">
			<div class="offset-xl-8 offset-lg-6 col-xl-2 col-lg-3 col-md-6 col-sm-12">
				<button mat-stroked-button color="primary" class="large mb-2" (click)="onCancel()">
					<i class="fa fa-times mr-2"></i>Cancel
				</button>
			</div>
			<div class="col-xl-2 col-lg-3 col-md-6 col-sm-12">
				<button mat-flat-button color="primary" class="large mb-2" (click)="onSave()">Save</button>
			</div>
		</div>
	`,
	styles: ``,
})
export class StepBusinessLicenceProfileComponent {
	branchesInBcFormGroup = this.businessApplicationService.branchesInBcFormGroup;

	constructor(private router: Router, private businessApplicationService: BusinessApplicationService) {}

	onCancel(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessApplications());
	}

	onSave(): void {
		// TODO save business profile
	}
}