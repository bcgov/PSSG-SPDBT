import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '@app/core/services/util.service';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { BusinessApplicationService } from '../../services/business-application.service';
import { CommonBusinessProfileComponent } from './common-business-profile.component';

@Component({
	selector: 'app-business-profile',
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

					<!-- <ng-container *ngIf="!isReadonly">
	<app-alert type="warning" icon="warning">Fill out your profile information </app-alert>
</ng-container> -->

					<app-common-business-profile
						[businessInformationFormGroup]="businessInformationFormGroup"
						[businessAddressFormGroup]="businessAddressFormGroup"
						[bcBusinessAddressFormGroup]="bcBusinessAddressFormGroup"
						[mailingAddressFormGroup]="mailingAddressFormGroup"
						[branchesInBcFormGroup]="branchesInBcFormGroup"
					></app-common-business-profile>

					<div class="row mt-3">
						<div class="col-12">
							<app-collection-notice></app-collection-notice>
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
export class BusinessProfileComponent {
	businessInformationFormGroup = this.businessApplicationService.businessInformationFormGroup;
	businessAddressFormGroup = this.businessApplicationService.businessAddressFormGroup;
	bcBusinessAddressFormGroup = this.businessApplicationService.bcBusinessAddressFormGroup;
	mailingAddressFormGroup = this.businessApplicationService.mailingAddressFormGroup;
	branchesInBcFormGroup = this.businessApplicationService.branchesInBcFormGroup;

	@ViewChild(CommonBusinessProfileComponent) businessProfileComponent!: CommonBusinessProfileComponent;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private businessApplicationService: BusinessApplicationService
	) {}

	onCancel(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessApplications());
	}

	onSave(): void {
		const isValid = this.businessProfileComponent.isFormValid();

		if (!isValid) {
			this.utilService.scrollToErrorSection();
			return;
		}

		// this.licenceApplicationService.saveLoginUserProfile().subscribe({
		// 	next: (_resp: any) => {
		// 		this.hotToastService.success('Your profile has been successfully updated');
		// 		this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
		// 	},
		// 	error: (error: any) => {
		// 		console.log('An error occurred during save', error);
		// 		this.hotToastService.error('An error occurred during the save. Please try again.');
		// 	},
		// });
		// TODO save business profile
	}
}
