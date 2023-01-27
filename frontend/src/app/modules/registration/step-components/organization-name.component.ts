import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationFormStepComponent } from '../registration.component';

export class OrganizationNameModel {
	organizationName: string = '';
}

@Component({
	selector: 'app-organization-name',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="step">
				<div class="title mb-5">Please provide us with more organization information:</div>

				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<mat-form-field>
							<mat-label>Organization Name</mat-label>
							<input matInput formControlName="organizationName" maxlength="160" required />
							<mat-hint>Please enter your 'Doing Business As' name</mat-hint>
							<img class="icon-size" matPrefix src="/assets/organization-name.png" />
							<mat-error *ngIf="form.get('organizationName')?.hasError('required')">Required</mat-error>
						</mat-form-field>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class OrganizationNameComponent implements OnInit, RegistrationFormStepComponent {
	form!: FormGroup;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			organizationName: new FormControl('', [Validators.required]),
		});
	}

	getDataToSave(): OrganizationNameModel {
		return this.form.value;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
