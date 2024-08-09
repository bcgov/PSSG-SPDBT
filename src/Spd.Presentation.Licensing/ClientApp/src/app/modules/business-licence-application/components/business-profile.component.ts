import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { UtilService } from '@app/core/services/util.service';
import { HotToastService } from '@ngneat/hot-toast';
import { BusinessLicenceApplicationRoutes } from '../business-licence-application-routing.module';
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

						<div class="col-xl-6 col-lg-4 col-md-12" *ngIf="isReadonly">
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

					<ng-container *ngIf="!isReadonly">
						<app-alert type="warning" icon="warning">Fill out your profile information </app-alert>
					</ng-container>

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

					<div class="row mt-3">
						<div class="col-12">
							<app-collection-notice></app-collection-notice>
						</div>
					</div>
				</div>
			</div>
		</div>

		<ng-container *ngIf="!isReadonly">
			<app-wizard-outside-footer
				nextButtonLabel="Save"
				(nextStepperStep)="onSave()"
				(cancel)="onCancel()"
			></app-wizard-outside-footer>
		</ng-container>
	`,
	styles: [],
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
		private hotToastService: HotToastService,
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
		const isValid = this.businessProfileComponent.isFormValid();

		if (!isValid) {
			this.utilService.scrollToErrorSection();
			return;
		}

		this.businessApplicationService.saveLoginBusinessProfile().subscribe({
			next: (_resp: any) => {
				this.hotToastService.success('Your business profile has been successfully updated');
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
