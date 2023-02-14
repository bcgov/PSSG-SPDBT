import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { RegistrationFormStepComponent } from '../org-registration.component';

@Component({
	selector: 'app-organization-information',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="step">
				<div class="col-md-8 col-sm-12 mx-auto">
					<div class="title mb-5">
						Does your organization have a shared have a shared inbox and/or central phone line?
					</div>
				</div>
				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<mat-radio-group
							class="funding-question__group"
							aria-label="Select an option"
							formControlName="hasPhoneOrEmail"
						>
							<mat-radio-button value="YES">
								<strong>Yes</strong>, we have a team inbox or generic organization email and central team phone number.
							</mat-radio-button>

							<ng-container *ngIf="hasPhoneOrEmail.value == 'YES'">
								<div class="row mt-2">
									<div class="col-lg-4 col-md-12 col-sm-12">
										<mat-form-field>
											<mat-label>Email Address</mat-label>
											<input
												matInput
												formControlName="genericEmail"
												type="email"
												maxlength="75"
												required
												[errorStateMatcher]="matcher"
											/>
											<mat-error *ngIf="form.get('genericEmail')?.hasError('email')">
												Must be a valid email address
											</mat-error>
											<mat-error *ngIf="form.get('genericEmail')?.hasError('required')">This is required</mat-error>
										</mat-form-field>
									</div>
									<div class="col-lg-4 col-md-12 col-sm-12">
										<mat-form-field>
											<mat-label>Confirm Email Address</mat-label>
											<input
												matInput
												formControlName="genericEmailConfirmation"
												type="email"
												maxlength="75"
												required
												[errorStateMatcher]="matcher"
											/>
											<mat-error *ngIf="form.get('genericEmailConfirmation')?.hasError('email')">
												Must be a valid email address
											</mat-error>
											<mat-error *ngIf="form.get('genericEmailConfirmation')?.hasError('required')">
												Required
											</mat-error>
											<mat-error *ngIf="form.get('genericEmailConfirmation')?.hasError('nomatch')">
												Emails must match
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-lg-4 col-md-12 col-sm-12">
										<mat-form-field>
											<mat-label>Phone Number</mat-label>
											<input
												matInput
												formControlName="genericPhoneNumber"
												mask="(000) 000-0000"
												[showMaskTyped]="true"
												required
												[errorStateMatcher]="matcher"
											/>
											<mat-error *ngIf="form.get('genericPhoneNumber')?.hasError('required')"
												>This is required</mat-error
											>
										</mat-form-field>
									</div>
								</div>
							</ng-container>

							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button value="NO">
								<strong>No</strong>, we have a team inbox or generic organization email and central team phone number.
							</mat-radio-button>
							<mat-error
								*ngIf="
									(form.get('hasPhoneOrEmail')?.dirty || form.get('hasPhoneOrEmail')?.touched) &&
									form.get('hasPhoneOrEmail')?.invalid &&
									form.get('hasPhoneOrEmail')?.hasError('required')
								"
								>This is required</mat-error
							>
						</mat-radio-group>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [
		`
			.org-information {
				%__group {
					text-align: left;
				}
			}
		`,
	],
})
export class OrganizationInformationComponent implements OnInit, RegistrationFormStepComponent {
	form!: FormGroup;
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group(
			{
				hasPhoneOrEmail: new FormControl('', [Validators.required]),
				genericEmail: new FormControl('', [Validators.email, Validators.required]),
				genericEmailConfirmation: new FormControl('', [Validators.email, Validators.required]),
				genericPhoneNumber: new FormControl('', [Validators.required]),
			},
			{
				validators: [FormGroupValidators.match('genericEmail', 'genericEmailConfirmation')],
			}
		);
	}

	get isEmailMismatch() {
		return this.form.getError('emailMismatch');
	}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		if (!this.hasPhoneOrEmail || !this.hasPhoneOrEmail.value) return false;
		return this.hasPhoneOrEmail.value == 'YES' ? this.form.valid : true;
	}

	clearCurrentData(): void {
		this.form.reset();
	}

	public get hasPhoneOrEmail(): FormControl {
		return this.form.get('hasPhoneOrEmail') as FormControl;
	}
}
