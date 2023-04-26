import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { CrcFormStepComponent } from '../crc-application.component';

@Component({
	selector: 'app-personal-information',
	template: `
		<section class="step-section pt-4 pb-5 px-3">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title
						title="Your personal information"
						subtitle="Date of birth must match your government-issued identification"
					></app-step-title>
					<div class="row">
						<div class="offset-lg-2 col-lg-4 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>Date of Birth</mat-label>
								<input
									matInput
									[matDatepicker]="picker"
									formControlName="contactDateOfBirth"
									[errorStateMatcher]="matcher"
								/>
								<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
								<mat-datepicker #picker startView="multi-year" [startAt]="startDate"></mat-datepicker>
								<mat-error *ngIf="form.get('contactDateOfBirth')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-4 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>BC Drivers License # <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="driversLicenseNumber" mask="00000009" />
								<mat-error *ngIf="form.get('driversLicenseNumber')?.hasError('mask')">
									This must be 7 or 8 digits
								</mat-error>
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>Birthplace</mat-label>
								<input
									matInput
									formControlName="birthplace"
									placeholder="City, Country"
									[errorStateMatcher]="matcher"
									maxlength="100"
								/>
								<mat-error *ngIf="form.get('birthplace')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [],
})
export class PersonalInformationComponent implements CrcFormStepComponent {
	form: FormGroup = this.formBuilder.group({
		birthplace: new FormControl('', [Validators.required]),
		driversLicenseNumber: new FormControl(''),
		contactDateOfBirth: new FormControl('', [Validators.required]),
	});
	startDate = new Date(2000, 0, 1);
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder) {}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
