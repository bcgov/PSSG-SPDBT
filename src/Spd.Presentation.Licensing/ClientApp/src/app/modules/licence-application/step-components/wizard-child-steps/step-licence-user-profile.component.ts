import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';
import { LicenceApplicationService } from '../../services/licence-application.service';
import { UserProfileComponent } from '../user-profile.component';

@Component({
	selector: 'app-step-licence-user-profile',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Confirm your profile"></app-step-title>
				<div class="step-container">
					<div class="row">
						<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
							<app-alert type="warning" icon="warning"
								>Make sure your profile information is up-to-date before renewing or updating your licence or permit, or
								starting a new application
							</app-alert>

							<app-user-profile></app-user-profile>

							<form [formGroup]="form" novalidate>
								<div>
									<mat-divider class="mat-divider-main2 mt-4"></mat-divider>
									<div class="fs-5 pt-2 pb-3">Confirmation</div>
									<mat-checkbox formControlName="profileIsUpToDate">
										I confirm that this information is up-to-date
									</mat-checkbox>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(form.get('profileIsUpToDate')?.dirty || form.get('profileIsUpToDate')?.touched) &&
											form.get('profileIsUpToDate')?.invalid &&
											form.get('profileIsUpToDate')?.hasError('required')
										"
									>
										This is required
									</mat-error>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepLicenceUserProfileComponent implements LicenceChildStepperStepComponent {
	@ViewChild(UserProfileComponent) userProfileComponent!: UserProfileComponent;

	form: FormGroup = this.licenceApplicationService.profileFormGroup;

	constructor(private router: Router, private licenceApplicationService: LicenceApplicationService) {}

	onCancel(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceApplications());
	}

	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		// const isValid = this.form.valid;
		// const isProfileValid = this.userProfileComponent.isFormValid();
		// return isValid && isProfileValid;
		return true;
	}
}
