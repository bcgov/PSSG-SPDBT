import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { UtilService } from '@app/core/services/util.service';
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
					<div class="fs-6 fw-bold my-3">{{ alertText }}</div>

					<app-common-business-profile
						[businessInformationFormGroup]="businessInformationFormGroup"
						[businessManagerFormGroup]="businessManagerFormGroup"
						[businessAddressFormGroup]="businessAddressFormGroup"
						[bcBusinessAddressFormGroup]="bcBusinessAddressFormGroup"
						[businessMailingAddressFormGroup]="businessMailingAddressFormGroup"
						[branchesInBcFormGroup]="branchesInBcFormGroup"
						[isBcBusinessAddress]="isBcBusinessAddress"
						[isReadonly]="false"
					></app-common-business-profile>

					<section class="mb-3" *ngIf="showConfirmation">
						<form [formGroup]="profileConfirmationFormGroup" novalidate>
							<div class="text-minor-heading mb-2">Confirmation</div>
							<mat-checkbox formControlName="isProfileUpToDate">
								I confirm that this information is up-to-date
							</mat-checkbox>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(profileConfirmationFormGroup.get('isProfileUpToDate')?.dirty ||
										profileConfirmationFormGroup.get('isProfileUpToDate')?.touched) &&
									profileConfirmationFormGroup.get('isProfileUpToDate')?.invalid &&
									profileConfirmationFormGroup.get('isProfileUpToDate')?.hasError('required')
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

		<app-wizard-footer
			[nextButtonLabel]="saveAndContinueLabel"
			[isWideNext]="true"
			(nextStepperStep)="onContinue()"
		></app-wizard-footer>
	`,
	styles: ``,
})
export class StepBusinessLicenceProfileComponent {
	applicationTypeCode: ApplicationTypeCode | null = null;

	alertText = '';
	saveAndContinueLabel = 'Save & Continue to Application';
	showConfirmation = false;

	profileConfirmationFormGroup = this.businessApplicationService.profileConfirmationFormGroup;
	businessInformationFormGroup = this.businessApplicationService.businessInformationFormGroup;
	businessManagerFormGroup = this.businessApplicationService.businessManagerFormGroup;
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

	onContinue(): void {
		if (this.showConfirmation) {
			this.profileConfirmationFormGroup.markAllAsTouched();
		}

		const isValid =
			this.businessProfileComponent.isFormValid() &&
			(this.showConfirmation ? this.profileConfirmationFormGroup.valid : true);

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
