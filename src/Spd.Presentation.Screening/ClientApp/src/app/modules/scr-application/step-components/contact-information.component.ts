import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxMaskPipe } from 'ngx-mask';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { ScreeningFormStepComponent } from '../scr-application.component';

@Component({
	selector: 'app-contact-information',
	template: `
		<section class="step-section pt-4 pb-5 px-3">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title
						title="Confirm your information"
						subtitle="Legal name must match your government-issued identification"
					></app-step-title>
					<div class="row">
						<div class="offset-lg-1 col-lg-3 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>Legal Given Name</mat-label>
								<input matInput formControlName="contactGivenName" [errorStateMatcher]="matcher" />
								<mat-error *ngIf="form.get('contactGivenName')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('contactGivenName')?.hasError('stringnonumbers')">
									No numbers are allowed
								</mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-3 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="contactMiddleName1" [errorStateMatcher]="matcher" />
								<mat-error *ngIf="form.get('contactMiddleName1')?.hasError('stringnonumbers')">
									No numbers are allowed
								</mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-3 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="contactMiddleName2" [errorStateMatcher]="matcher" />
								<mat-error *ngIf="form.get('contactMiddleName2')?.hasError('stringnonumbers')">
									No numbers are allowed
								</mat-error>
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="offset-lg-1 col-lg-3 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>Legal Surname</mat-label>
								<input matInput formControlName="contactSurname" [errorStateMatcher]="matcher" />
								<mat-error *ngIf="form.get('contactSurname')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('contactSurname')?.hasError('stringnonumbers')">
									No numbers are allowed
								</mat-error>
							</mat-form-field>
							<div class="w-100 mb-4">
								<mat-checkbox formControlName="oneLegalName"> I have one legal name </mat-checkbox>
							</div>
						</div>
						<div class="col-lg-3 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Email Address</mat-label>
								<input
									matInput
									formControlName="contactEmail"
									placeholder="name@domain.com"
									[errorStateMatcher]="matcher"
								/>
								<mat-error *ngIf="form.get('contactEmail')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('contactEmail')?.hasError('email')">
									Must be a valid email address
								</mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-3 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Phone Number</mat-label>
								<input matInput formControlName="contactPhoneNumber" [mask]="phoneMask" [showMaskTyped]="true" />
								<mat-error *ngIf="form.get('contactPhoneNumber')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('contactPhoneNumber')?.hasError('mask')">This must be 10 digits</mat-error>
							</mat-form-field>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [``],
})
export class ContactInformationComponent implements ScreeningFormStepComponent {
	phoneMask = SPD_CONSTANTS.phone.displayMask;
	form: FormGroup = this.formBuilder.group(
		{
			contactGivenName: new FormControl('Pulled-From-Portal', [
				FormControlValidators.stringnonumbers,
				Validators.required,
			]),
			contactMiddleName1: new FormControl('', [FormControlValidators.stringnonumbers]),
			contactMiddleName2: new FormControl('', [FormControlValidators.stringnonumbers]),
			contactSurname: new FormControl('', [FormControlValidators.stringnonumbers]),
			contactEmail: new FormControl('Pulled@From.Portal', [Validators.email, Validators.required]),
			contactPhoneNumber: new FormControl('6048185356', [Validators.required]),
			oneLegalName: new FormControl(false),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('contactSurname', (form) => !form.get('oneLegalName')?.value),
			],
		}
	);
	startDate = new Date(2000, 0, 1);
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder, private maskPipe: NgxMaskPipe) {}

	getDataToSave(): any {
		const data = this.form.value;
		data.contactPhoneNumber = this.maskPipe.transform(data.contactPhoneNumber, SPD_CONSTANTS.phone.backendMask);
		return data;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
