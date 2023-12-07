import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from 'src/app/api/models';
import { LicenceChildStepperStepComponent } from '../services/licence-application.helper';
import { LicenceApplicationService } from '../services/licence-application.service';

@Component({
	selector: 'app-licence-application-type',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="What type of Security Worker Licence are you applying for?"></app-step-title>
				<div class="step-container">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-12 col-sm-12 mx-auto">
							<form [formGroup]="form" novalidate>
								<mat-radio-group aria-label="Select an option" formControlName="applicationTypeCode">
									<div class="row">
										<div class="col-lg-4">
											<mat-radio-button class="radio-label" [value]="applicationTypeCodes.New">New</mat-radio-button>
										</div>
										<div class="col-lg-8">
											<app-alert type="info" icon="">
												Apply for a new licence if you've never held this type of licence, or if your exisiting licence
												has expired.
											</app-alert>
										</div>
									</div>
									<mat-divider class="mb-3"></mat-divider>
									<div class="row">
										<div class="col-lg-4">
											<mat-radio-button class="radio-label" [value]="applicationTypeCodes.Renewal"
												>Renewal</mat-radio-button
											>
										</div>
										<div class="col-lg-8">
											<app-alert type="info" icon="">
												Renew your existing licence before it expires, within 90 days of the expiry date.
											</app-alert>
										</div>
									</div>
									<mat-divider class="mb-3"></mat-divider>
									<div class="row">
										<div class="col-lg-4">
											<mat-radio-button class="radio-label" [value]="applicationTypeCodes.Replacement">
												Replacement
											</mat-radio-button>
										</div>
										<div class="col-lg-8">
											<app-alert type="info" icon="">
												Lost your licence? Request a replacement card and we'll send you one.
											</app-alert>
										</div>
									</div>
									<mat-divider class="mb-3"></mat-divider>
									<div class="row">
										<div class="col-lg-4">
											<mat-radio-button class="radio-label" [value]="applicationTypeCodes.Update"
												>Update</mat-radio-button
											>
										</div>
										<div class="col-lg-8">
											<app-alert type="info" icon="">
												Update contact details, legal name, report new criminal charges or convictions, and more. Some
												updates require a processing fee.
											</app-alert>
										</div>
									</div>
								</mat-radio-group>
							</form>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('applicationTypeCode')?.dirty || form.get('applicationTypeCode')?.touched) &&
									form.get('applicationTypeCode')?.invalid &&
									form.get('applicationTypeCode')?.hasError('required')
								"
								>An option must be selected</mat-error
							>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LicenceApplicationTypeComponent implements LicenceChildStepperStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.licenceApplicationService.applicationTypeFormGroup;

	constructor(private router: Router, private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
