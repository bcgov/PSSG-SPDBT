import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxMaskPipe } from 'ngx-mask';
import { BooleanTypeCode } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { RegistrationFormStepComponent } from '../org-registration.component';

@Component({
	selector: 'app-organization-information',
	template: `
		<section class="step-section p-4">
			<div class="step">
				<app-step-title
					title="Your organization's shared or generic email account and central phone line"
					subtitle="This is where criminal record check results will be returned to"
				></app-step-title>
				<form [formGroup]="form" novalidate>
					<div class="offset-md-2 col-md-8 col-sm-12">
						<div class="row mt-2">
							<div class="col-lg-6 col-md-12 col-sm-12">
								<mat-form-field>
									<mat-label>Shared or Generic Email Account</mat-label>
									<input
										matInput
										formControlName="genericEmail"
										type="email"
										placeholder="hiring@organization.ca"
										[errorStateMatcher]="matcher"
										maxlength="75"
									/>
									<mat-error *ngIf="form.get('genericEmail')?.hasError('email')">
										Must be a valid email address
									</mat-error>
									<mat-error *ngIf="form.get('genericEmail')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-lg-6 col-md-12 col-sm-12">
								<mat-form-field>
									<mat-label>Central Phone Number</mat-label>
									<input
										matInput
										formControlName="genericPhoneNumber"
										[mask]="phoneMask"
										[showMaskTyped]="false"
										[errorStateMatcher]="matcher"
									/>
									<mat-error *ngIf="form.get('genericPhoneNumber')?.hasError('required')"> This is required </mat-error>
									<mat-error *ngIf="form.get('genericPhoneNumber')?.hasError('mask')">
										This must be 10 digits
									</mat-error>
								</mat-form-field>
							</div>

							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('genericEmail')?.dirty || form.get('genericEmail')?.touched) &&
									form.invalid &&
									form.hasError('atleastonerequired')
								"
								>An email account or phone number must be provided
							</mat-error>
						</div>
					</div>
				</form>
			</div>
		</section>
	`,
	styles: [],
})
export class OrganizationInformationComponent implements OnInit, RegistrationFormStepComponent {
	phoneMask = SPD_CONSTANTS.phone.displayMask;
	form!: FormGroup;
	matcher = new FormErrorStateMatcher();

	booleanTypeCodes = BooleanTypeCode;

	constructor(private formBuilder: FormBuilder, private maskPipe: NgxMaskPipe) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			genericEmail: new FormControl('', [FormControlValidators.required, FormControlValidators.email]),
			genericPhoneNumber: new FormControl(''),
		});
	}

	getDataToSave(): any {
		const data = this.form.value;
		data.genericPhoneNumber = this.maskPipe.transform(data.genericPhoneNumber, SPD_CONSTANTS.phone.backendMask);
		return data;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}

	clearCurrentData(): void {
		this.form.reset();
	}
}
