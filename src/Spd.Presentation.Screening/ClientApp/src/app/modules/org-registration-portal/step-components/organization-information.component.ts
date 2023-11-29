import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
					title="Does your organization have a shared inbox and/or central phone line?"
					subtitle="This is where criminal record check results will be returned to"
				></app-step-title>
				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="offset-md-4 col-md-4 col-sm-12">
							<mat-radio-group aria-label="Select an option" formControlName="hasPhoneOrEmail">
								<mat-radio-button [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-3"></mat-divider>
								<mat-radio-button [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('hasPhoneOrEmail')?.dirty || form.get('hasPhoneOrEmail')?.touched) &&
									form.get('hasPhoneOrEmail')?.invalid &&
									form.get('hasPhoneOrEmail')?.hasError('required')
								"
								>An option must be selected</mat-error
							>
						</div>
					</div>

					<div class="row mt-4" *ngIf="hasPhoneOrEmail.value === booleanTypeCodes.Yes">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-divider class="my-3" style="border-top-color: var(--color-primary-light);"></mat-divider>
							<div class="text-minor-heading fw-semibold mb-2">Shared Inbox Information</div>
							<ng-container *ngIf="hasPhoneOrEmail.value === booleanTypeCodes.Yes">
								<div class="row mt-2">
									<div class="col-lg-6 col-md-12 col-sm-12">
										<mat-form-field>
											<mat-label>Email</mat-label>
											<input
												matInput
												formControlName="genericEmail"
												type="email"
												required
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
											<mat-label>Phone Number</mat-label>
											<input
												matInput
												formControlName="genericPhoneNumber"
												[mask]="phoneMask"
												[showMaskTyped]="false"
												required
												[errorStateMatcher]="matcher"
											/>
											<mat-error *ngIf="form.get('genericPhoneNumber')?.hasError('required')">
												This is required
											</mat-error>
											<mat-error *ngIf="form.get('genericPhoneNumber')?.hasError('mask')">
												This must be 10 digits
											</mat-error>
										</mat-form-field>
									</div>
								</div>
							</ng-container>
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
			hasPhoneOrEmail: new FormControl('', [FormControlValidators.required]),
			genericEmail: new FormControl('', [Validators.required, FormControlValidators.email]),
			genericPhoneNumber: new FormControl('', [Validators.required]),
		});
	}

	get isEmailMismatch() {
		return this.form.getError('emailMismatch');
	}

	getDataToSave(): any {
		const data = this.form.value;
		data.genericPhoneNumber = this.maskPipe.transform(data.genericPhoneNumber, SPD_CONSTANTS.phone.backendMask);
		return data;
	}

	isFormValid(): boolean {
		if (!this.hasPhoneOrEmail?.value) return false;
		return this.hasPhoneOrEmail.value == BooleanTypeCode.Yes ? this.form.valid : true;
	}

	clearCurrentData(): void {
		this.form.reset();
	}

	public get hasPhoneOrEmail(): FormControl {
		return this.form.get('hasPhoneOrEmail') as FormControl;
	}
}
