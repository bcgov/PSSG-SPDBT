import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationFormStepComponent } from '../registration.component';

export class OrganizationInformationModel {
	hasPhoneOrEmail: string = '';
	genericEmail: string = '';
	genericEmailConfirmation: string = '';
	genericPhoneNumber: string = '';
	genericPhoneExt: string = '';
}

@Component({
	selector: 'app-organization-information',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="step">
				<div class="title mb-5">Do you have a team generic email or phone number?</div>
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
									<div class="offset-md-2 col-md-8 col-sm-12">
										<mat-form-field>
											<mat-label>Email Address</mat-label>
											<input matInput formControlName="genericEmail" type="email" maxlength="75" required />
											<img class="icon-size" matPrefix src="/assets/email.png" />
											<mat-error *ngIf="form.get('genericEmail')?.hasError('email')">
												Must be a valid email address
											</mat-error>
											<mat-error *ngIf="form.get('genericEmail')?.hasError('required')">Required</mat-error>
										</mat-form-field>
									</div>
								</div>
								<div class="row">
									<div class="offset-md-2 col-md-8 col-sm-12">
										<mat-form-field>
											<mat-label>Confirm Email Address</mat-label>
											<input matInput formControlName="genericEmailConfirmation" type="email" maxlength="75" required />
											<img class="icon-size" matPrefix src="/assets/email.png" />
											<mat-error *ngIf="form.get('genericEmailConfirmation')?.hasError('email')">
												Must be a valid email address
											</mat-error>
											<mat-error *ngIf="form.get('genericEmailConfirmation')?.hasError('required')">
												Required
											</mat-error>
											<!-- <mat-error *ngIf="isEmailMismatch">Emails must match</mat-error>
											<div *ngIf="isEmailMismatch">Emails must match</div> -->
										</mat-form-field>
									</div>
								</div>
								<div class="row">
									<div class="offset-md-2 col-md-4 col-sm-12">
										<mat-form-field>
											<mat-label>Phone Number</mat-label>
											<input
												matInput
												formControlName="genericPhoneNumber"
												mask="(000) 000-0000"
												[showMaskTyped]="true"
												required
											/>
											<mat-error *ngIf="form.get('genericPhoneNumber')?.hasError('required')">Required</mat-error>
										</mat-form-field>
									</div>
									<div class="col-md-4 col-sm-12">
										<mat-form-field>
											<mat-label>Ext. (optional)</mat-label>
											<input matInput formControlName="genericPhoneExt" />
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
								>Required</mat-error
							>
						</mat-radio-group>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [
		`
			.funding-question {
				%__group {
					text-align: left;
				}
			}
		`,
	],
})
export class OrganizationInformationComponent implements OnInit, RegistrationFormStepComponent {
	form!: FormGroup;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group(
			{
				hasPhoneOrEmail: new FormControl('', [Validators.required]),
				genericEmail: new FormControl('', [Validators.email, Validators.required]),
				genericEmailConfirmation: new FormControl('', [Validators.email, Validators.required]),
				genericPhoneNumber: new FormControl('', [Validators.required]),
				genericPhoneExt: new FormControl(''),
			}
			// {
			// 	validator: (form: FormGroup) => {
			// 		return form.get('email')?.value !== form.get('emailConfirmation')?.value ? { emailMismatch: true } : null;
			// 	},
			// }
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

	public get hasPhoneOrEmail(): FormControl {
		return this.form.get('hasPhoneOrEmail') as FormControl;
	}
}
