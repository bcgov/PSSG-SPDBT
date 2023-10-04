import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';

@Component({
	selector: 'app-mental-health-conditions',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="Have you been treated for any of the following Mental Health Conditions?"
					subtitle="These conditions include mood disorders (such as depression and bipolar disorder), schizophrenia, anxiety disorders, personality disorders."
				></app-step-title>
				<div class="step-container">
					<div class="row">
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
							<form [formGroup]="form" novalidate>
								<mat-radio-group aria-label="Select an option" formControlName="isTreatedForMHC">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
							</form>
						</div>
					</div>

					<div class="row mt-4" *ngIf="isTreatedForMHC.value == booleanTypeCodes.Yes">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
							<ng-container>
								<div class="row mt-2">
									<div class="col-12">
										<div class="text-minor-heading fw-normal mb-2">Upload your Mental Health Condition Form</div>
										<app-file-upload [maxNumberOfFiles]="1" accept=".jpg,.tif,.png,.bmp"></app-file-upload>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('proofOfFingerprint')?.dirty || form.get('proofOfFingerprint')?.touched) &&
												form.get('proofOfFingerprint')?.invalid &&
												form.get('proofOfFingerprint')?.hasError('required')
											"
											>This is required</mat-error
										>
										<div class="field-hint mt-2">Maximum file size is 25 MB</div>
										<div class="field-hint">Format must be .jpg, .tif, .png, or .bmp</div>
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
export class MentalHealthConditionsComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.formBuilder.group({
		isTreatedForMHC: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}

	get isTreatedForMHC(): FormControl {
		return this.form.get('isTreatedForMHC') as FormControl;
	}
}
