import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { UtilService } from '@app/core/services/util.service';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { BusinessApplicationService } from '../../services/business-application.service';
import { CommonBusinessProfileComponent } from './common-business-profile.component';

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
					</div>

					<mat-divider class="mat-divider-main mb-3"></mat-divider>
					<app-alert type="warning" icon="warning"> {{ alertText }}</app-alert>

					<app-common-business-profile
						[businessInformationFormGroup]="businessInformationFormGroup"
						[businessAddressFormGroup]="businessAddressFormGroup"
						[bcBusinessAddressFormGroup]="bcBusinessAddressFormGroup"
						[businessMailingAddressFormGroup]="businessMailingAddressFormGroup"
						[branchesInBcFormGroup]="branchesInBcFormGroup"
						[isBcBusinessAddress]="isBcBusinessAddress"
						[isReadonly]="false"
					></app-common-business-profile>

					<section *ngIf="showConfirmation">
						<form [formGroup]="form" novalidate>
							<div class="text-minor-heading py-2">Confirmation</div>
							<mat-checkbox formControlName="isProfileUpToDate">
								I confirm that this information is up-to-date
							</mat-checkbox>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('isProfileUpToDate')?.dirty || form.get('isProfileUpToDate')?.touched) &&
									form.get('isProfileUpToDate')?.invalid &&
									form.get('isProfileUpToDate')?.hasError('required')
								"
							>
								This is required
							</mat-error>
						</form>
					</section>

					<div class="mt-3">
						<app-collection-notice></app-collection-notice>
					</div>
				</div>
			</div>
		</section>

		<app-wizard-footer [nextButtonLabel]="saveAndContinueLabel" (nextStepperStep)="onContinue()"></app-wizard-footer>
	`,
	styles: ``,
})
export class StepBusinessLicenceProfileComponent implements OnInit {
	applicationTypeCode: ApplicationTypeCode | null = null;

	alertText = '';
	saveAndContinueLabel = 'Save & Continue to Application';
	showConfirmation = false;

	form = this.businessApplicationService.profileConfirmationFormGroup;
	businessInformationFormGroup = this.businessApplicationService.businessInformationFormGroup;
	businessAddressFormGroup = this.businessApplicationService.businessAddressFormGroup;
	bcBusinessAddressFormGroup = this.businessApplicationService.bcBusinessAddressFormGroup;
	businessMailingAddressFormGroup = this.businessApplicationService.businessMailingAddressFormGroup;
	branchesInBcFormGroup = this.businessApplicationService.branchesInBcFormGroup;

	@ViewChild(CommonBusinessProfileComponent) businessProfileComponent!: CommonBusinessProfileComponent;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private businessApplicationService: BusinessApplicationService
	) {
		const state = this.router.getCurrentNavigation()?.extras.state;
		this.applicationTypeCode = state ? state['applicationTypeCode'] : null;

		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.Replacement: {
				this.alertText = 'Make sure your address information is up-to-date before replacing your licence.';
				this.saveAndContinueLabel = 'Save & Proceed to Replacement';
				this.showConfirmation = true;
				break;
			}
			case ApplicationTypeCode.Renewal: {
				this.alertText = 'Make sure your profile information is up-to-date before renewing your licence.';
				this.saveAndContinueLabel = 'Save & Proceed to Renewal';
				this.showConfirmation = true;
				break;
			}
			case ApplicationTypeCode.Update: {
				this.alertText = 'Make sure your profile information is up-to-date before updating your licence.';
				this.saveAndContinueLabel = 'Save & Proceed to Update';
				this.showConfirmation = true;
				break;
			}
			default: {
				this.alertText =
					'Make sure your profile information is up-to-date before renewing or updating your licence, or starting a new application.';
				break;
			}
		}
	}

	ngOnInit(): void {
		if (!this.businessApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessApplications());
		}
	}

	onContinue(): void {
		const isValid = this.businessProfileComponent.isFormValid();

		if (!isValid) {
			this.utilService.scrollToErrorSection();
			return;
		}

		this.businessApplicationService.saveBusinessProfileAndContinue(this.applicationTypeCode!).subscribe();
	}

	get isBcBusinessAddress(): boolean {
		return this.businessApplicationService.isBcBusinessAddress();
	}
}
