import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
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

							<div class="col-xl-6 col-lg-4 col-md-12">
								<div class="d-flex justify-content-end">
									<button
										mat-stroked-button
										color="primary"
										class="large w-auto mb-3"
										aria-label="Back"
										(click)="onBack()"
									>
										<mat-icon>arrow_back</mat-icon>Back
									</button>
								</div>
							</div>
						</div>
						<mat-divider class="mat-divider-main mb-3"></mat-divider>

						<app-alert type="warning" icon="warning"> {{ alertText }}</app-alert>

						<section>
							<app-common-user-profile
								[personalInformationFormGroup]="personalInformationFormGroup"
								[contactFormGroup]="contactFormGroup"
								[aliasesFormGroup]="aliasesFormGroup"
								[residentialAddressFormGroup]="residentialAddressFormGroup"
								[mailingAddressFormGroup]="mailingAddressFormGroup"
							></app-common-user-profile>
						</section>

						<ng-container *ngIf="isNotReplacment">
							<mat-divider class="mat-divider-main mt-3"></mat-divider>
							<section>
								<app-common-user-profile-licence-criminal-history
									[applicationTypeCode]="applicationTypeCode"
								></app-common-user-profile-licence-criminal-history>
							</section>

							<mat-divider class="mat-divider-main mt-3"></mat-divider>
							<section>
								<app-common-user-profile-licence-police-background
									[applicationTypeCode]="applicationTypeCode"
								></app-common-user-profile-licence-police-background>
							</section>

							<mat-divider class="mat-divider-main mt-3"></mat-divider>
							<section>
								<app-common-user-profile-licence-mental-health-conditions
									[applicationTypeCode]="applicationTypeCode"
								></app-common-user-profile-licence-mental-health-conditions>
							</section>
						</ng-container>

						<section>
							<form [formGroup]="form" novalidate>
								<div>
									<mat-divider class="mat-divider-main mt-2"></mat-divider>
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
								</div>
							</form>
						</section>

						<div class="mt-3">
							<app-alert type="info" icon="" [showBorder]="false">
								<div class="mb-2">COLLECTION NOTICE</div>
								All information regarding this application is collected under the <i>Security Services Act</i> and its
								Regulation and will be used for that purpose. The use of this information will comply with the
								<i>Freedom of Information</i> and <i>Privacy Act</i> and the federal <i>Privacy Act</i>. If you have any
								questions regarding the collection or use of this information, please contact
								<a href="mailto:securitylicensing@gov.bc.ca">securitylicensing&#64;gov.bc.ca</a>
							</app-alert>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row mt-3">
			<div class="offset-xl-6 offset-lg-5 col-xl-2 col-lg-3 col-md-6 col-sm-12">
				<button mat-stroked-button color="primary" class="large mb-2" (click)="onCancel()">
					<i class="fa fa-times mr-2"></i>Cancel
				</button>
			</div>
			<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
				<button mat-flat-button color="primary" class="large mb-2" (click)="onContinue()">
					Save & Continue to Application
				</button>
			</div>
		</div>
	`,
	styles: [],
})
export class StepWorkerLicenceUserProfileComponent implements OnInit, LicenceChildStepperStepComponent {
	alertText = '';

	form: FormGroup = this.licenceApplicationService.profileConfirmationFormGroup;
	workerLicenceTypeCode: WorkerLicenceTypeCode | null = null;
	applicationTypeCode: ApplicationTypeCode | null = null;

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

	constructor(
		private router: Router,
		private utilService: UtilService,
		private licenceApplicationService: LicenceApplicationService
	) {
		// check if a licenceNumber was passed from 'WorkerLicenceFirstTimeUserSelectionComponent'
		const state = this.router.getCurrentNavigation()?.extras.state;
		this.applicationTypeCode = state && state['applicationTypeCode'];
		this.workerLicenceTypeCode = state && state['workerLicenceTypeCode'];

		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.Replacement: {
				this.alertText = 'Make sure your profile information is up-to-date before replacing your licence or permit';
				break;
			}
			case ApplicationTypeCode.Renewal: {
				this.alertText = 'Make sure your profile information is up-to-date before renewing your licence or permit';
				break;
			}
			case ApplicationTypeCode.Update: {
				this.alertText = 'Make sure your profile information is up-to-date before updating your licence or permit';
				break;
			}
			default: {
				this.alertText = 'Fill out your profile information';
				break;
			}
		}
	}

	ngOnInit(): void {
		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated());
		}
	}

	onCancel(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();

		const isValid1 = this.form.valid;
		const isValid2 = this.userProfileComponent.isFormValid();
		const isValid3 = this.criminalHistoryComponent.isFormValid();
		const isValid4 = this.policeBackgroundComponent.isFormValid();
		const isValid5 = this.mentalHealthComponent.isFormValid();

		const isValid = isValid1 && isValid2 && isValid3 && isValid4 && isValid5;

		if (!isValid) {
			this.utilService.scrollToErrorSection();
		}

		return isValid;
	}

	onStepPrevious(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated());
	}

	onContinue(): void {
		if (!this.isFormValid()) {
			return;
		}

		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.Replacement: {
				// this.router.navigateByUrl(
				// 	LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
				// 		LicenceApplicationRoutes.WORKER_LICENCE_RENEW_AUTHENTICATED
				// 	)
				// );
				break;
			}
			case ApplicationTypeCode.Renewal: {
				this.router.navigateByUrl(
					LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
						LicenceApplicationRoutes.WORKER_LICENCE_RENEW_AUTHENTICATED
					)
				);
				break;
			}
			case ApplicationTypeCode.Update: {
				this.router.navigateByUrl(
					LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
						LicenceApplicationRoutes.WORKER_LICENCE_UPDATE_AUTHENTICATED
					)
				);
				break;
			}
			default: {
				this.router.navigateByUrl(
					LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
						LicenceApplicationRoutes.WORKER_LICENCE_NEW_AUTHENTICATED
					)
				);
				break;
			}
		}
	}

	onBack(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
	}

	get isNotReplacment(): boolean {
		return this.applicationTypeCode != ApplicationTypeCode.Replacement;
	}
}
