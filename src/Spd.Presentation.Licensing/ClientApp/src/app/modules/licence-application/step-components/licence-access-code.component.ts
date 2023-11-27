import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-licence-access-code',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Provide your access code"
					info="	<p>
							You need both your licence number as it appears on your current licence, plus the access code number
							provided following your initial security worker application and in your renewal letter from the Registrar,
							Security Services. Enter the two numbers below then click 'Next' to continue.
						</p>
						<p>
							If you do not know your access code, you may call Security Program's Licensing Unit during regular office
							hours and answer identifying questions to get your access code: 1-855-587-0185.
						</p>"
				>
				</app-step-title>
				<div class="step-container">
					<div class="row">
						<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12 mx-auto">
							<form [formGroup]="form" novalidate>
								<div class="row mt-4">
									<div class="col-xxl-6 col-xl-6 col-lg-12 col-md-12">
										<mat-form-field>
											<mat-label>Current Licence Number</mat-label>
											<input matInput formControlName="currentLicenceNumber" [errorStateMatcher]="matcher" />
											<mat-error *ngIf="form.get('currentLicenceNumber')?.hasError('required')">
												This is required
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-xxl-6 col-xl-6 col-lg-12 col-md-12">
										<mat-form-field>
											<mat-label>Access Code</mat-label>
											<input matInput formControlName="accessCode" [errorStateMatcher]="matcher" />
											<mat-error *ngIf="form.get('accessCode')?.hasError('required')"> This is required </mat-error>
										</mat-form-field>
									</div>
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
export class LicenceAccessCodeComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.formBuilder.group({
		currentLicenceNumber: new FormControl(null, [Validators.required]),
		accessCode: new FormControl(null, [Validators.required]),
	});

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
