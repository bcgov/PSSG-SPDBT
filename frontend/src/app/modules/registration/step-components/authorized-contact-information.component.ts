import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationFormStepComponent } from '../registration.component';

export class AuthorizedContactModel {
	contactGivenName: string = '';
	contactSurname: string = '';
	contactJobTitle: string = '';
	contactEmail: string = '';
	contactDateOfBirth: string = '';
	contactPhoneNumber: string = '';
	contactPhoneExt: string = '';
}

@Component({
	selector: 'app-authorized-contact-information',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="step">
				<div class="title mb-5">Please provide your work contact information:</div>
				<div class="row">
					<div class="offset-md-2 col-md-4 col-sm-12">
						<mat-form-field>
							<mat-label>Given Name</mat-label>
							<input matInput formControlName="contactGivenName" maxlength="40" />
							<mat-error *ngIf="form.get('contactGivenName')?.hasError('required')">Required</mat-error>
							<mat-error *ngIf="form.get('contactGivenName')?.hasError('pattern')"
								>Only characters are allowed</mat-error
							>
						</mat-form-field>
					</div>
					<div class="col-md-4 col-sm-12">
						<mat-form-field>
							<mat-label>Surname</mat-label>
							<input matInput formControlName="contactSurname" maxlength="40" />
							<mat-error *ngIf="form.get('contactSurname')?.hasError('required')">Required</mat-error>
							<mat-error *ngIf="form.get('contactSurname')?.hasError('pattern')">Only characters are allowed</mat-error>
						</mat-form-field>
					</div>
				</div>
				<div class="row">
					<div class="offset-md-2 col-md-4 col-sm-12">
						<mat-form-field>
							<mat-label>Job Title</mat-label>
							<input matInput formControlName="contactJobTitle" maxlength="100" />
							<mat-error *ngIf="form.get('contactJobTitle')?.hasError('required')">Required</mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-4 col-sm-12">
						<mat-form-field>
							<mat-label>Your Work Email Address</mat-label>
							<input matInput formControlName="contactEmail" placeholder="name@domain.com" maxlength="75" />
							<mat-error *ngIf="form.get('contactEmail')?.hasError('email')"> Must be a valid email address </mat-error>
							<mat-error *ngIf="form.get('contactEmail')?.hasError('required')">Required</mat-error>
						</mat-form-field>
					</div>
				</div>
				<div class="row">
					<div class="offset-md-2 col-md-2 col-sm-12">
						<mat-form-field>
							<mat-label>Date of Birth</mat-label>
							<input matInput [matDatepicker]="picker" formControlName="contactDateOfBirth" />
							<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
							<mat-datepicker #picker startView="multi-year" [startAt]="startDate"></mat-datepicker>
							<mat-error *ngIf="form.get('contactDateOfBirth')?.hasError('required')">Required</mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-3 col-sm-12">
						<mat-form-field>
							<mat-label>Direct Phone Number</mat-label>
							<input matInput formControlName="contactPhoneNumber" mask="(000) 000-0000" [showMaskTyped]="true" />
							<mat-error *ngIf="form.get('contactPhoneNumber')?.hasError('required')">Required</mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-3 col-sm-12">
						<mat-form-field>
							<mat-label>Ext. (optional)</mat-label>
							<input matInput formControlName="contactPhoneExt" />
						</mat-form-field>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class AuthorizedContactInformationComponent implements OnInit, RegistrationFormStepComponent {
	form!: FormGroup;

	startDate = new Date(2000, 0, 1);

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			contactGivenName: new FormControl('', [Validators.pattern("^[a-zA-Z -']+"), Validators.required]),
			contactSurname: new FormControl('', [Validators.pattern("^[a-zA-Z -']+"), Validators.required]),
			contactJobTitle: new FormControl('', [Validators.required]),
			contactEmail: new FormControl('', [Validators.email, Validators.required]),
			contactDateOfBirth: new FormControl('', [Validators.required]),
			contactPhoneNumber: new FormControl('', [Validators.required]),
			contactPhoneExt: new FormControl(''),
		});
	}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
