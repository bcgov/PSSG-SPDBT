import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { UtilService } from '@app/core/services/util.service';
import { CommonUserProfileComponent } from '@app/modules/licence-application/components/authenticated/user-profile/common-user-profile.component';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { CommonUserProfileLicenceCriminalHistoryComponent } from '../../authenticated/user-profile/common-user-profile-licence-criminal-history.component';
import { CommonUserProfileLicenceMentalHealthConditionsComponent } from '../../authenticated/user-profile/common-user-profile-licence-mental-health-conditions.component';
import { CommonUserProfileLicencePoliceBackgroundComponent } from '../../authenticated/user-profile/common-user-profile-licence-police-background.component';

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
						<app-alert type="warning" icon="warning"> {{ alertText }}</app-alert>

						<app-common-user-profile
							[personalInformationFormGroup]="personalInformationFormGroup"
							[contactFormGroup]="contactFormGroup"
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
			</div>
		</div>

		<app-wizard-footer [nextButtonLabel]="saveAndContinueLabel" (nextStepperStep)="onContinue()"></app-wizard-footer>
	`,
	styles: [],
})
export class StepWorkerLicenceUserProfileComponent implements OnInit, LicenceChildStepperStepComponent {
	alertText = '';
	saveAndContinueLabel = 'Save & Continue to Application';

	form: FormGroup = this.licenceApplicationService.profileConfirmationFormGroup;
	applicationTypeCode: ApplicationTypeCode | null = null;
	showConfirmation = false;

	@ViewChild(CommonUserProfileComponent) userProfileComponent!: CommonUserProfileComponent;
	@ViewChild(CommonUserProfileLicenceCriminalHistoryComponent)
	criminalHistoryComponent!: CommonUserProfileLicenceCriminalHistoryComponent;
	@ViewChild(CommonUserProfileLicencePoliceBackgroundComponent)
	policeBackgroundComponent!: CommonUserProfileLicencePoliceBackgroundComponent;
	@ViewChild(CommonUserProfileLicenceMentalHealthConditionsComponent)
	mentalHealthComponent!: CommonUserProfileLicenceMentalHealthConditionsComponent;

	personalInformationFormGroup = this.licenceApplicationService.personalInformationFormGroup;
	contactFormGroup = this.licenceApplicationService.contactInformationFormGroup;
	aliasesFormGroup = this.licenceApplicationService.aliasesFormGroup;
	residentialAddressFormGroup = this.licenceApplicationService.residentialAddressFormGroup;
	mailingAddressFormGroup = this.licenceApplicationService.mailingAddressFormGroup;
	criminalHistoryFormGroup = this.licenceApplicationService.criminalHistoryFormGroup;
	mentalHealthConditionsFormGroup = this.licenceApplicationService.mentalHealthConditionsFormGroup;
	policeBackgroundFormGroup = this.licenceApplicationService.policeBackgroundFormGroup;

	isReadonlyPersonalInfo = false;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private licenceApplicationService: LicenceApplicationService
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

	ngOnInit(): void {
		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated());
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
			this.licenceApplicationService.saveUserProfileAndContinue(this.applicationTypeCode).subscribe();
			return;
		}
	}

	get isVisibleBackgroundInfo(): boolean {
		return this.applicationTypeCode != ApplicationTypeCode.Replacement;
	}
}
