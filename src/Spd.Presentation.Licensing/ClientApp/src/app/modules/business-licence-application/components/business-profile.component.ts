import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { UtilService } from '@app/core/services/util.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';

import { CommonBusinessProfileComponent } from './common-business-profile.component';

@Component({
	selector: 'app-business-profile',
	template: `
		<div class="step-section">
			<div class="row">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Business Profile</h2>
						</div>

						<div class="col-xl-6 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								<ng-container *ngIf="isReadonly">
									<button
										mat-stroked-button
										color="primary"
										class="large w-auto mb-3"
										aria-label="Back to main page"
										(click)="onCancel()"
									>
										<mat-icon>arrow_back</mat-icon>Back
									</button>
								</ng-container>
							</div>
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<app-common-business-profile
						[businessInformationFormGroup]="businessInformationFormGroup"
						[businessManagerFormGroup]="businessManagerFormGroup"
						[businessAddressFormGroup]="businessAddressFormGroup"
						[bcBusinessAddressFormGroup]="bcBusinessAddressFormGroup"
						[businessMailingAddressFormGroup]="businessMailingAddressFormGroup"
						[branchesInBcFormGroup]="branchesInBcFormGroup"
						[isBcBusinessAddress]="isBcBusinessAddress"
						[isReadonly]="isReadonly"
					></app-common-business-profile>

					<app-collection-notice></app-collection-notice>

					<div class="row mt-3" *ngIf="!isReadonly">
						<div class="offset-xl-6 col-xl-6 offset-lg-6 col-lg-6 col-md-12">
							<div class="d-flex justify-content-end">
								<button
									mat-stroked-button
									color="primary"
									class="large mx-3 mb-3"
									aria-label="Cancel and return to main page"
									(click)="onCancel()"
								>
									Cancel
								</button>
								<button
									mat-flat-button
									color="primary"
									class="large mx-3 mb-3"
									aria-label="Save and return to main page"
									(click)="onSave()"
								>
									Save
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class BusinessProfileComponent implements OnInit {
	businessInformationFormGroup = this.businessApplicationService.businessInformationFormGroup;
	businessManagerFormGroup = this.businessApplicationService.businessManagerFormGroup;
	businessAddressFormGroup = this.businessApplicationService.businessAddressFormGroup;
	bcBusinessAddressFormGroup = this.businessApplicationService.bcBusinessAddressFormGroup;
	businessMailingAddressFormGroup = this.businessApplicationService.businessMailingAddressFormGroup;
	branchesInBcFormGroup = this.businessApplicationService.branchesInBcFormGroup;

	isReadonly = true;

	@ViewChild(CommonBusinessProfileComponent) businessProfileComponent!: CommonBusinessProfileComponent;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private businessApplicationService: BusinessApplicationService
	) {
		// check if isReadonly was passed from 'BusinessUserApplicationsComponent'
		const state = this.router.getCurrentNavigation()?.extras.state;
		this.isReadonly = state && state['isReadonly'];
	}

	ngOnInit(): void {
		if (!this.businessApplicationService.initialized) {
			this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessLicence());
			return;
		}
	}

	onCancel(): void {
		this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
	}

	onSave(): void {
		const { isValid, areBranchesValid } = this.businessProfileComponent.isFormValid();

		if (!areBranchesValid) {
			return;
		} else if (!isValid) {
			this.utilService.scrollToErrorSection();
			return;
		}

		this.businessApplicationService.saveLoginBusinessProfile().subscribe({
			next: (_resp: any) => {
				this.utilService.toasterSuccess('Your business profile has been successfully updated');
				this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	get isBcBusinessAddress(): boolean {
		return this.businessApplicationService.isBcBusinessAddress();
	}
}
