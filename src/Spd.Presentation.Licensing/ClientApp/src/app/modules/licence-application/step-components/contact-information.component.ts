import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceChildStepperStepComponent } from '../services/licence-application.helper';
import { LicenceApplicationService } from '../services/licence-application.service';

@Component({
	selector: 'app-contact-information',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-lg-4 col-md-6 col-sm-12" [ngClass]="isWizardStep ? 'offset-lg-2' : ''">
					<mat-form-field>
						<mat-label>Email Address</mat-label>
						<input
							matInput
							formControlName="contactEmailAddress"
							[errorStateMatcher]="matcher"
							placeholder="name@domain.com"
							maxlength="75"
						/>
						<mat-error *ngIf="form.get('contactEmailAddress')?.hasError('required')"> This is required </mat-error>
						<mat-error *ngIf="form.get('contactEmailAddress')?.hasError('email')">
							Must be a valid email address
						</mat-error>
					</mat-form-field>
				</div>
				<div class="col-lg-4 col-md-6 col-sm-12">
					<mat-form-field>
						<mat-label>Phone Number</mat-label>
						<input matInput formControlName="contactPhoneNumber" [errorStateMatcher]="matcher" [mask]="phoneMask" />
						<mat-error *ngIf="form.get('contactPhoneNumber')?.hasError('required')">This is required</mat-error>
						<mat-error *ngIf="form.get('contactPhoneNumber')?.hasError('mask')"> This must be 10 digits </mat-error>
					</mat-form-field>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class ContactInformationComponent implements LicenceChildStepperStepComponent {
	phoneMask = SPD_CONSTANTS.phone.displayMask;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.licenceApplicationService.contactInformationFormGroup;

	@Input() isWizardStep = true;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
