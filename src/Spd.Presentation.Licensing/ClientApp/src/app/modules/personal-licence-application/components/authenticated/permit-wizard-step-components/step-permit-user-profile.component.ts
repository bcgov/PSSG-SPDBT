import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { CommonUserProfileComponent } from '@app/modules/personal-licence-application/components/authenticated/user-profile-components/common-user-profile.component';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';

@Component({
	selector: 'app-step-permit-user-profile',
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

						<section>
							<app-common-user-profile
								[personalInformationFormGroup]="personalInformationFormGroup"
								[contactInformationFormGroup]="contactInformationFormGroup"
								[aliasesFormGroup]="aliasesFormGroup"
								[residentialAddressFormGroup]="residentialAddressFormGroup"
								[mailingAddressFormGroup]="mailingAddressFormGroup"
								[characteristicsFormGroup]="characteristicsFormGroup"
								[isReadonlyPersonalInfo]="false"
								[isReadonlyMailingAddress]="false"
							></app-common-user-profile>
						</section>

						<section class="mb-3" *ngIf="showConfirmation">
							<form [formGroup]="form" novalidate>
								<div class="text-minor-heading mb-2">Confirmation</div>
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

						<app-collection-notice [collectionNoticeActName]="collectionNoticeActName"></app-collection-notice>
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
export class StepPermitUserProfileComponent implements OnInit, LicenceChildStepperStepComponent {
	alertText = '';
	collectionNoticeActName = '';
	saveAndContinueLabel = 'Save & Continue to Application';

	form: FormGroup = this.permitApplicationService.profileConfirmationFormGroup;
	serviceTypeCode: ServiceTypeCode | null = null;
	applicationTypeCode: ApplicationTypeCode | null = null;
	showConfirmation = false;

	@ViewChild(CommonUserProfileComponent) userProfileComponent!: CommonUserProfileComponent;

	personalInformationFormGroup = this.permitApplicationService.personalInformationFormGroup;
	contactInformationFormGroup = this.permitApplicationService.contactInformationFormGroup;
	aliasesFormGroup = this.permitApplicationService.aliasesFormGroup;
	residentialAddressFormGroup = this.permitApplicationService.residentialAddressFormGroup;
	mailingAddressFormGroup = this.permitApplicationService.mailingAddressFormGroup;
	characteristicsFormGroup = this.permitApplicationService.characteristicsFormGroup;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private permitApplicationService: PermitApplicationService
	) {
		// check if a licenceNumber was passed from 'WorkerLicenceFirstTimeUserSelectionComponent'
		const state = this.router.getCurrentNavigation()?.extras.state;
		this.serviceTypeCode = state ? state['serviceTypeCode'] : null;
		this.applicationTypeCode = state ? state['applicationTypeCode'] : null;

		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.Renewal: {
				this.alertText = 'Make sure your profile information is up-to-date before renewing your permit.';
				this.saveAndContinueLabel = 'Save & Proceed to Renewal';
				this.showConfirmation = true;
				break;
			}
			case ApplicationTypeCode.Update: {
				this.alertText = 'Make sure your profile information is up-to-date before updating your permit.';
				this.saveAndContinueLabel = 'Save & Proceed to Update';
				this.showConfirmation = true;
				break;
			}
			default: {
				this.alertText =
					'Make sure your profile information is up-to-date before renewing or updating your permit, or starting a new application.';
				break;
			}
		}
	}

	ngOnInit(): void {
		if (!this.permitApplicationService.initialized) {
			this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathPermitAuthenticated());
			return;
		}

		if (this.serviceTypeCode === ServiceTypeCode.ArmouredVehiclePermit) {
			this.collectionNoticeActName = 'Armoured Vehicle and After-Market Compartment Control Act (AVAMCCA)';
		} else {
			this.collectionNoticeActName = 'Body Armour Control Act (BACA)';
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();

		const isValid1 = this.form.valid;
		const isValid2 = this.userProfileComponent.isFormValid();

		const isValid = isValid1 && isValid2;

		console.debug('[StepPermitUserProfileComponent] isFormValid', isValid1, isValid2);

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
			this.permitApplicationService
				.saveUserProfileAndContinue(this.serviceTypeCode!, this.applicationTypeCode)
				.subscribe();
			return;
		}
	}

	onBack(): void {
		this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathUserApplications());
	}
}
