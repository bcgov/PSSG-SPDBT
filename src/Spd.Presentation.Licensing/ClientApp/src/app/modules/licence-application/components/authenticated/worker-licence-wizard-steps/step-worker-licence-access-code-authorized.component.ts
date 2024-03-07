import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
	selector: 'app-step-worker-licence-access-code-authorized',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6">
							<h2 class="fs-3 mb-3">Link a Licence or Permit</h2>
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

					<app-alert type="info" icon="">
						<p>
							You need both <strong>your licence number</strong> as it appears on your current licence, plus the
							<strong>access code number</strong>
							provided following your initial security worker application or in your renewal letter from the Registrar,
							Security Services. Enter the two numbers below then click 'Link' to continue.
						</p>
						<p>
							If you do not know your access code, you may call Security Program's Licensing Unit during regular office
							hours and answer identifying questions to get your access code: {{ spdPhoneNumber }}.
						</p>
					</app-alert>

					<form [formGroup]="form" novalidate>
						<div class="row mt-4">
							<div class="offset-xxl-1 col-xxl-4 offset-xl-1 col-xl-4 col-lg-4 col-md-12">
								<mat-form-field>
									<mat-label>Current Licence Number</mat-label>
									<input matInput formControlName="licenceNumber" [errorStateMatcher]="matcher" maxlength="10" />
									<mat-error *ngIf="form.get('licenceNumber')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-4 col-lg-4 col-md-12">
								<mat-form-field>
									<mat-label>Access Code</mat-label>
									<input matInput formControlName="accessCode" [errorStateMatcher]="matcher" />
									<mat-error *ngIf="form.get('accessCode')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-2 col-xl-2 col-lg-4 col-md-12">
								<button mat-flat-button color="primary" class="large mt-2" (click)="onLink()">
									<mat-icon>link</mat-icon>Link
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceAccessCodeAuthorizedComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	form: FormGroup = this.licenceApplicationService.accessCodeFormGroup;

	licenceNumber: string | null = null;

	constructor(
		private router: Router,
		private hotToastService: HotToastService,
		private licenceApplicationService: LicenceApplicationService
	) {
		// check if a licenceNumber was passed from 'WorkerLicenceFirstTimeUserSelectionComponent'
		const state = this.router.getCurrentNavigation()?.extras.state;
		this.licenceNumber = state && state['licenceNumber'] ? state['licenceNumber'] : null;
		if (this.licenceNumber) {
			this.form.patchValue({ licenceNumber: this.licenceNumber });
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onLink(): void {
		const isValid = this.isFormValid();
		if (!isValid) return;

		this.hotToastService.success('The licence or permit has been successfully linked to your account');
		this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
	}

	onBack(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
	}
}
