import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { CommonUserProfileLicenceCriminalHistoryComponent } from '@app/modules/personal-licence-application/components/authenticated/user-profile-components/common-user-profile-licence-criminal-history.component';
import { CommonUserProfileLicenceMentalHealthConditionsComponent } from '@app/modules/personal-licence-application/components/authenticated/user-profile-components/common-user-profile-licence-mental-health-conditions.component';
import { CommonUserProfileLicencePoliceBackgroundComponent } from '@app/modules/personal-licence-application/components/authenticated/user-profile-components/common-user-profile-licence-police-background.component';
import { CommonUserProfileComponent } from '@app/modules/personal-licence-application/components/authenticated/user-profile-components/common-user-profile.component';

@Component({
	selector: 'app-step-worker-licence-user-profile',
	template: `
		<div class="step-section">
			<div class="step">
				<div class="row">
					<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6 my-auto">
								<h2 class="fs-3">Confirm your Profile</h2>
							</div>
						</div>

						<mat-divider class="mat-divider-main mb-3"></mat-divider>
						<div class="fs-6 fw-bold my-3">{{ alertText }}</div>

						<app-common-user-profile
							[personalInformationFormGroup]="personalInformationFormGroup"
							[contactInformationFormGroup]="contactInformationFormGroup"
							[aliasesFormGroup]="aliasesFormGroup"
							[residentialAddressFormGroup]="residentialAddressFormGroup"
							[mailingAddressFormGroup]="mailingAddressFormGroup"
							[isReadonlyPersonalInfo]="isReadonlyPersonalInfo"
							[isReadonlyMailingAddress]="false"
						></app-common-user-profile>

						<ng-container *ngIf="isVisibleBackgroundInfo">
							<section>
								<app-common-user-profile-licence-criminal-history
									[form]="criminalHistoryFormGroup"
									[applicationTypeCode]="applicationTypeCode"
								></app-common-user-profile-licence-criminal-history>
							</section>

							<section>
								<app-common-user-profile-licence-police-background
									[form]="policeBackgroundFormGroup"
									[applicationTypeCode]="applicationTypeCode"
								></app-common-user-profile-licence-police-background>
							</section>

							<section>
								<app-common-user-profile-licence-mental-health-conditions
									[form]="mentalHealthConditionsFormGroup"
									[applicationTypeCode]="applicationTypeCode"
								></app-common-user-profile-licence-mental-health-conditions>
							</section>
						</ng-container>

						<section class="mb-2" *ngIf="showConfirmation">
							<form [formGroup]="form" novalidate>
								<div class="text-minor-heading">Confirmation</div>
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

						<app-collection-notice></app-collection-notice>
					</div>
				</div>
			</div>
		</div>

		<app-wizard-footer
			[nextButtonLabel]="saveAndContinueLabel"
			[isWideNext]="true"
			(nextStepperStep)="onContinue()"
		></app-wizard-footer>
	`,
	styles: [],
})
export class StepWorkerLicenceUserProfileComponent implements LicenceChildStepperStepComponent {
	alertText = '';
	saveAndContinueLabel = 'Save & Continue to Application';

	form: FormGroup = this.workerApplicationService.profileConfirmationFormGroup;
	applicationTypeCode: ApplicationTypeCode | null = null;
	showConfirmation = false;

	@ViewChild(CommonUserProfileComponent) userProfileComponent!: CommonUserProfileComponent;
	@ViewChild(CommonUserProfileLicenceCriminalHistoryComponent)
	criminalHistoryComponent!: CommonUserProfileLicenceCriminalHistoryComponent;
	@ViewChild(CommonUserProfileLicencePoliceBackgroundComponent)
	policeBackgroundComponent!: CommonUserProfileLicencePoliceBackgroundComponent;
	@ViewChild(CommonUserProfileLicenceMentalHealthConditionsComponent)
	mentalHealthComponent!: CommonUserProfileLicenceMentalHealthConditionsComponent;

	personalInformationFormGroup = this.workerApplicationService.personalInformationFormGroup;
	contactInformationFormGroup = this.workerApplicationService.contactInformationFormGroup;
	aliasesFormGroup = this.workerApplicationService.aliasesFormGroup;
	residentialAddressFormGroup = this.workerApplicationService.residentialAddressFormGroup;
	mailingAddressFormGroup = this.workerApplicationService.mailingAddressFormGroup;
	criminalHistoryFormGroup = this.workerApplicationService.criminalHistoryFormGroup;
	mentalHealthConditionsFormGroup = this.workerApplicationService.mentalHealthConditionsFormGroup;
	policeBackgroundFormGroup = this.workerApplicationService.policeBackgroundFormGroup;

	isReadonlyPersonalInfo = false;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private workerApplicationService: WorkerApplicationService
	) {
		const state = this.router.getCurrentNavigation()?.extras.state;
		this.applicationTypeCode = state ? state['applicationTypeCode'] : null;

		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.Replacement: {
				this.alertText = 'Make sure your address information is up-to-date before replacing your licence.';
				this.saveAndContinueLabel = 'Save & Proceed to Replacement';
				this.showConfirmation = true;
				this.isReadonlyPersonalInfo = true;
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

	isFormValid(): boolean {
		this.form.markAllAsTouched();

		const isValid1 = this.form.valid;
		const isValid2 = this.userProfileComponent.isFormValid();
		const isValid3 = this.isVisibleBackgroundInfo ? this.criminalHistoryComponent.isFormValid() : true;
		const isValid4 = this.isVisibleBackgroundInfo ? this.policeBackgroundComponent.isFormValid() : true;
		const isValid5 = this.isVisibleBackgroundInfo ? this.mentalHealthComponent.isFormValid() : true;

		const isValid = isValid1 && isValid2 && isValid3 && isValid4 && isValid5;

		console.debug(
			'[StepWorkerLicenceUserProfileComponent] isFormValid',
			isValid1,
			isValid2,
			isValid3,
			isValid4,
			isValid5
		);

		if (!isValid) {
			this.utilService.scrollToErrorSection();
		}

		return isValid;
	}

	onContinue(): void {
		if (!this.isFormValid()) {
			return;
		}

		if (this.applicationTypeCode) {
			this.workerApplicationService.saveUserProfileAndContinue(this.applicationTypeCode).subscribe();
			return;
		}
	}

	get isVisibleBackgroundInfo(): boolean {
		return this.applicationTypeCode != ApplicationTypeCode.Replacement;
	}
}
