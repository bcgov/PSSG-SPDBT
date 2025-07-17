import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { CommonUserProfileComponent } from '@app/modules/personal-licence-application/components/authenticated/user-profile-components/common-user-profile.component';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';

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
							[characteristicsFormGroup]="characteristicsFormGroup"
							[isReadonlyPersonalInfo]="isReadonlyPersonalInfo"
							[isReadonlyMailingAddress]="false"
						></app-common-user-profile>

						@if (showConfirmation) {
							<section class="mb-3">
								<form [formGroup]="form" novalidate>
									<div class="text-minor-heading mb-2">Confirmation</div>
									<mat-checkbox formControlName="isProfileUpToDate">
										I confirm that this information is up-to-date
									</mat-checkbox>
									@if (
										(form.get('isProfileUpToDate')?.dirty || form.get('isProfileUpToDate')?.touched) &&
										form.get('isProfileUpToDate')?.invalid &&
										form.get('isProfileUpToDate')?.hasError('required')
									) {
										<mat-error class="mat-option-error"> This is required</mat-error>
									}
								</form>
							</section>
						}

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
	standalone: false,
})
export class StepWorkerLicenceUserProfileComponent implements OnInit, LicenceChildStepperStepComponent {
	alertText = '';
	saveAndContinueLabel = 'Save & Continue to Application';

	form: FormGroup = this.workerApplicationService.profileConfirmationFormGroup;
	applicationTypeCode: ApplicationTypeCode | null = null;
	showConfirmation = false;

	@ViewChild(CommonUserProfileComponent) userProfileComponent!: CommonUserProfileComponent;

	personalInformationFormGroup = this.workerApplicationService.personalInformationFormGroup;
	contactInformationFormGroup = this.workerApplicationService.contactInformationFormGroup;
	aliasesFormGroup = this.workerApplicationService.aliasesFormGroup;
	residentialAddressFormGroup = this.workerApplicationService.residentialAddressFormGroup;
	mailingAddressFormGroup = this.workerApplicationService.mailingAddressFormGroup;
	characteristicsFormGroup = this.workerApplicationService.characteristicsFormGroup;

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

	ngOnInit(): void {
		if (!this.workerApplicationService.initialized) {
			this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated());
			return;
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();

		const isValid1 = this.form.valid;
		const isValid2 = this.userProfileComponent.isFormValid();

		const isValid = isValid1 && isValid2;

		console.debug('[StepWorkerLicenceUserProfileComponent] isFormValid', isValid1, isValid2);

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
}
