import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { GenderTypes } from 'src/app/core/code-types/model-desc.models';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-police-background',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="Are you currently a Police Officer or Peace Officer?"
					subtitle="A member of a police force as defined in the British Columbia Police Act may not hold a security worker licence."
				></app-step-title>
				<div class="step-container row">
					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<mat-radio-group aria-label="Select an option" formControlName="isPoliceOrPeaceOfficer">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
						</form>
					</div>

					<div class="row mt-4" *ngIf="isPoliceOrPeaceOfficer.value == booleanTypeCodes.Yes">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
							<div class="text-minor-heading mb-2">Current Information</div>
							<ng-container>
								<div class="row mt-2">
									<div class="col-lg-4 col-md-12 col-sm-12">
										<mat-form-field>
											<mat-label>Role</mat-label>
											<mat-select formControlName="officerRole">
												<mat-option *ngFor="let gdr of genderTypes" [value]="gdr.code">
													{{ gdr.desc }}
												</mat-option>
											</mat-select>
											<mat-error *ngIf="form.get('officerRole')?.hasError('required')">This is required</mat-error>
										</mat-form-field>
									</div>
								</div>
								<div class="row mt-2">
									<div class="col-12">
										<div class="text-minor-heading fw-normal mb-2">
											Upload a letter of no conflict from your superior officer
										</div>
										<app-file-upload [maxNumberOfFiles]="1" accept=".jpg,.tif,.png,.bmp"></app-file-upload>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('photoOfYourself')?.dirty || form.get('photoOfYourself')?.touched) &&
												form.get('photoOfYourself')?.invalid &&
												form.get('photoOfYourself')?.hasError('required')
											"
											>This is required</mat-error
										>
										<div class="mt-2">
											See Section 2.5.4 of the
											<a
												href="https://www2.gov.bc.ca/assets/gov/employment-business-and-economic-development/business-management/security-services/industry/legislation/licensingpolicy.pdf"
												target="_blank"
											>
												Security Licensing Process and Licence Conditions Policies</a
											>
											for details on what must be in the letter.
										</div>
										<!-- 
										<div class="field-hint mt-2">Maximum file size is 25 MB</div>
									<div class="field-hint">Format must be .jpg, .tif, .png, or .bmp</div> -->
									</div>
								</div>
							</ng-container>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class PoliceBackgroundComponent {
	booleanTypeCodes = BooleanTypeCode;
	genderTypes = GenderTypes;

	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.formBuilder.group({
		isPoliceOrPeaceOfficer: new FormControl(''),
		officerRole: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}

	get isPoliceOrPeaceOfficer(): FormControl {
		return this.form.get('isPoliceOrPeaceOfficer') as FormControl;
	}
}
