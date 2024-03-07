import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonUserProfileComponent } from '@app/modules/licence-application/components/shared/step-components/common-user-profile.component';
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
						<app-alert type="warning" icon="warning">
							Make sure your profile information is up-to-date before renewing or updating your licence or permit, or
							starting a new application
						</app-alert>

						<app-common-user-profile></app-common-user-profile>
						<mat-divider class="mat-divider-main mt-3"></mat-divider>

						<app-step-worker-licence-police-background></app-step-worker-licence-police-background>
						<mat-divider class="mat-divider-main mt-3"></mat-divider>

						<app-step-worker-licence-mental-health-conditions></app-step-worker-licence-mental-health-conditions>
						<mat-divider class="mat-divider-main mt-3"></mat-divider>

						<app-step-worker-licence-criminal-history></app-step-worker-licence-criminal-history>

						<form [formGroup]="form" novalidate>
							<div>
								<mat-divider class="mat-divider-main mt-2"></mat-divider>
								<div class="text-minor-heading pt-2 pb-3">Confirmation</div>
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

	form: FormGroup = this.licenceApplicationService.profileConfirmationFormGroup;

	constructor(private router: Router, private licenceApplicationService: LicenceApplicationService) {}

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
		const isValid = this.form.valid;
		const isProfileValid = this.userProfileComponent.isFormValid();

		// console.log('StepLicenceUserProfileComponent', isValid, isProfileValid);
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
