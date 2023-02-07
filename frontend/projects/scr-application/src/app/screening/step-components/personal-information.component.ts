import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-personal-information',
	template: `
		<section class="step-section pt-4 pb-5">
			<div class="step">
				<div class="title mb-5">Next, confirm your personal information:</div>
				<div class="row">
					<div class="offset-md-2 col-md-4 col-sm-12">
						<mat-form-field>
							<mat-label>Date of Birth</mat-label>
							<input matInput [matDatepicker]="picker" formControlName="contactDateOfBirth" />
							<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
							<mat-datepicker #picker startView="multi-year" [startAt]="startDate"></mat-datepicker>
							<mat-error *ngIf="form.get('contactDateOfBirth')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-4 col-sm-12">
						<mat-form-field>
							<mat-label>Birthplace Country</mat-label>
							<input matInput formControlName="birthplaceCountry" maxlength="40" />
							<mat-error *ngIf="form.get('birthplaceCountry')?.hasError('required')">This is required</mat-error>
							<mat-error *ngIf="form.get('birthplaceCountry')?.hasError('pattern')">
								Only characters are allowed
							</mat-error>
						</mat-form-field>
					</div>
				</div>
				<div class="row">
					<div class="offset-md-2 col-md-4 col-sm-12">
						<mat-form-field>
							<mat-label>Birthplace City</mat-label>
							<input matInput formControlName="birthplaceCity" maxlength="40" />
							<mat-error *ngIf="form.get('birthplaceCity')?.hasError('required')">This is required</mat-error>
							<mat-error *ngIf="form.get('birthplaceCity')?.hasError('pattern')">Only characters are allowed</mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-4 col-sm-12">
						<mat-form-field>
							<mat-label>Do you have a BC Drivers License? (optional)</mat-label>
							<input matInput formControlName="driversLicenseNumber" />
						</mat-form-field>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class PersonalInformationComponent {
	form: FormGroup = this.formBuilder.group({
		birthplaceCountry: new FormControl('', [Validators.required]),
		birthplaceCity: new FormControl('', [Validators.required]),
		driversLicenseNumber: new FormControl(''),
		contactDateOfBirth: new FormControl('', [Validators.required]),
	});
	startDate = new Date(2000, 0, 1);

	constructor(private formBuilder: FormBuilder) {}
}
