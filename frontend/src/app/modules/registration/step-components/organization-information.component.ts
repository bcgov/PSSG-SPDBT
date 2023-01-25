import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { RegistrationFormStepComponent } from '../registration.component';

export class OrganizationInformationModel {
	phoneOrEmailFlag: string = '';
	email: string = '';
	emailConfirmation: string = '';
	areaCode: string = '';
	phoneNumber: string = '';
	ext: string = '';
}

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'app-organization-information',
	template: `
		<form [formGroup]="form">
			<div class="step">
				<div class="title mb-5">Do you have a team generic email or phone number?</div>
				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<mat-radio-group
							class="funding-question__group"
							aria-label="Select an option"
							formControlName="phoneOrEmailFlag"
						>
							<mat-radio-button value="YES">
								<strong>Yes</strong>, we have a team inbox or generic organization email and central team phone number.
							</mat-radio-button>

							<ng-container *ngIf="phoneOrEmailFlag.value == 'YES'">
								<div class="row mt-2">
									<div class="offset-md-1 col-md-10 col-sm-12">
										<mat-form-field>
											<input matInput formControlName="email" placeholder="Email Address" />
											<img class="icon-size" matPrefix src="/assets/email.png" />
											<mat-error *ngIf="form.get('email')?.hasError('email')">Invalid Email</mat-error>
										</mat-form-field>
									</div>
								</div>
								<div class="row">
									<div class="offset-md-1 col-md-10 col-sm-12">
										<mat-form-field>
											<input matInput formControlName="emailConfirmation" placeholder="Confirm Email Address" />
											<img class="icon-size" matPrefix src="/assets/email.png" />
											<mat-error *ngIf="form.get('email')?.hasError('email')">Invalid Email</mat-error>
											<!-- <mat-error *ngIf="isEmailMismatch">Emails must match</mat-error>
											<div *ngIf="isEmailMismatch">Emails must match</div> -->
										</mat-form-field>
									</div>
								</div>
								<div class="row">
									<div class="offset-md-1 col-md-3 col-sm-12">
										<mat-form-field>
											<input matInput formControlName="areaCode" placeholder="Area Code" />
										</mat-form-field>
									</div>
									<div class="col-md-4 col-sm-12">
										<mat-form-field>
											<input matInput formControlName="phoneNumber" placeholder="Phone Number" />
											<mat-hint>XXX-XXX-XXXX</mat-hint>
										</mat-form-field>
									</div>
									<div class="col-md-3 col-sm-12">
										<mat-form-field>
											<input matInput formControlName="ext" placeholder="Ext." />
										</mat-form-field>
									</div>
								</div>
							</ng-container>

							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button value="NO">
								<strong>No</strong>, we have a team inbox or generic organization email and central team phone number.
							</mat-radio-button>
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

	@Input() stepData!: OrganizationInformationModel;
	@Output() formValidity: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group(
			{
				phoneOrEmailFlag: new FormControl(''),
				email: new FormControl('', [Validators.email]),
				emailConfirmation: new FormControl('', [Validators.email]),
				areaCode: new FormControl(''),
				phoneNumber: new FormControl(''),
				ext: new FormControl(''),
			},
			{
				validator: (form: FormGroup) => {
					return form.get('email')?.value !== form.get('emailConfirmation')?.value ? { emailMismatch: true } : null;
				},
			}
		);

		this.form.valueChanges.subscribe((_val: any) => {
			this.stepData = this.form.value;
			this.formValidity.emit(this.isFormValid());
		});
	}

	get isEmailMismatch() {
		console.log(this.form.errors);
		return this.form.getError('emailMismatch');
	}

	getDataToSave(): any {
		return this.stepData;
	}

	isFormValid(): boolean {
		return this.stepData.phoneOrEmailFlag ? true : false;
	}

	public get phoneOrEmailFlag(): FormControl {
		return this.form.get('phoneOrEmailFlag') as FormControl;
	}
}
