import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-contact-information',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="Provide your contact information"></app-step-title>
				<div class="step-container row">
					<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<div class="row">
								<div class="col-md-6 col-sm-12">
									<mat-form-field>
										<mat-label>Email Address</mat-label>
										<input
											matInput
											formControlName="contactEmailAddress"
											placeholder="name@domain.com"
											maxlength="75"
										/>
										<mat-error *ngIf="form.get('contactEmailAddress')?.hasError('required')">
											This is required
										</mat-error>
										<mat-error *ngIf="form.get('contactEmailAddress')?.hasError('email')">
											Must be a valid email address
										</mat-error>
									</mat-form-field>
								</div>
								<div class="col-md-6 col-sm-12">
									<mat-form-field>
										<mat-label>Phone Number</mat-label>
										<input matInput formControlName="contactPhoneNumber" [mask]="phoneMask" [showMaskTyped]="true" />
										<mat-error *ngIf="form.get('contactPhoneNumber')?.hasError('required')">This is required</mat-error>
										<mat-error *ngIf="form.get('contactPhoneNumber')?.hasError('mask')"
											>This must be 10 digits</mat-error
										>
									</mat-form-field>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class ContactInformationComponent implements LicenceChildStepperStepComponent {
	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form: FormGroup = this.licenceApplicationService.contactInformationFormGroup;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
