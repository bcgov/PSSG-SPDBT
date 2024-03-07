import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { CommonUserProfileComponent } from '@app/modules/licence-application/components/authenticated/user-profile/common-user-profile.component';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-step-worker-licence-user-profile',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Confirm your profile"></app-step-title>

				<div class="row">
					<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<app-alert type="warning" icon="warning"> {{ alertText }}</app-alert>

						<app-common-user-profile></app-common-user-profile>

						<mat-divider class="mat-divider-main mt-3"></mat-divider>
						<app-common-user-profile-licence-criminal-history
							[applicationTypeCode]="applicationTypeCode"
						></app-common-user-profile-licence-criminal-history>

						<mat-divider class="mat-divider-main mt-3"></mat-divider>
						<app-common-user-profile-licence-police-background
							[applicationTypeCode]="applicationTypeCode"
						></app-common-user-profile-licence-police-background>

						<mat-divider class="mat-divider-main mt-3"></mat-divider>
						<app-common-user-profile-licence-mental-health-conditions
							[applicationTypeCode]="applicationTypeCode"
						></app-common-user-profile-licence-mental-health-conditions>

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
		</section>

		<div class="row wizard-button-row">
			<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
				<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
			</div>
			<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
				<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext()">Next</button>
			</div>
		</div>
	`,
	styles: [],
})
export class StepWorkerLicenceUserProfileComponent implements OnInit, LicenceChildStepperStepComponent {
	@ViewChild(CommonUserProfileComponent) userProfileComponent!: CommonUserProfileComponent;

	alertText = '';

	form: FormGroup = this.licenceApplicationService.profileConfirmationFormGroup;
	applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private router: Router, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated());
		}

		this.applicationTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
			'applicationTypeData.applicationTypeCode'
		)?.value;

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

	onCancel(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();

		const isValid = this.form.valid;
		const isProfileValid = this.userProfileComponent.isFormValid();

		return isValid && isProfileValid;
	}

	onStepPrevious(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated());
	}

	onStepNext(): void {
		if (this.isFormValid()) {
			this.router.navigateByUrl(
				LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
					LicenceApplicationRoutes.LICENCE_SELECTION_AUTHENTICATED
				)
			);
		}
	}
}
