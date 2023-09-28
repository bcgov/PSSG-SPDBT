import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { GenderTypes } from 'src/app/core/code-types/model-desc.models';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-citizenship',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="Were you born in Canada?"></app-step-title>
				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="isBornInCanada">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
							</div>
						</div>

						<div class="row mt-4" *ngIf="isBornInCanada.value" @showHideTriggerSlideAnimation>
							<div class="offset-md-2 col-md-8 col-sm-12">
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

								<ng-container *ngIf="isBornInCanada.value == booleanTypeCodes.Yes; else notBornInCanadaHeading">
									<div class="text-minor-heading mb-2">Born in Canada</div>
								</ng-container>
								<ng-template #notBornInCanadaHeading>
									<div class="text-minor-heading mb-2">Not Born in Canada</div>
								</ng-template>

								<ng-container>
									<div class="row mt-2">
										<div class="col-lg-6 col-md-12">
											<ng-container *ngIf="isBornInCanada.value == booleanTypeCodes.Yes; else notBornInCanada">
												<mat-form-field>
													<mat-label>Select proof of Canadian citizenship to upload</mat-label>
													<mat-select formControlName="proofOfCitizenship">
														<mat-option *ngFor="let gdr of genderTypes" [value]="gdr.code">
															{{ gdr.desc }}
														</mat-option>
													</mat-select>
												</mat-form-field>
											</ng-container>
											<ng-template #notBornInCanada>
												<mat-form-field>
													<mat-label>Select proof of ability to work in Canada</mat-label>
													<mat-select formControlName="proofOfAbility">
														<mat-option *ngFor="let gdr of genderTypes" [value]="gdr.code">
															{{ gdr.desc }}
														</mat-option>
													</mat-select>
												</mat-form-field>
											</ng-template>
										</div>
										<div class="col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Expiry Date</mat-label>
												<input
													matInput
													[matDatepicker]="picker"
													formControlName="documentExpiryDate"
													[max]="maxDate"
													[errorStateMatcher]="matcher"
												/>
												<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
												<mat-datepicker #picker startView="multi-year"></mat-datepicker>
												<mat-error *ngIf="form.get('documentExpiryDate')?.hasError('required')"
													>This is required</mat-error
												>
											</mat-form-field>
										</div>
									</div>
									<div class="row">
										<div class="col-12">
											<ng-container *ngIf="isBornInCanada.value == booleanTypeCodes.Yes; else notBornInCanadaTitle">
												<div class="text-minor-heading fw-normal mb-2">
													Upload a photo of your passport or birth certificate
												</div>
											</ng-container>
											<ng-template #notBornInCanadaTitle>
												<div class="text-minor-heading fw-normal mb-2">
													Upload a photo of your selected document type
												</div>
											</ng-template>
											<app-file-upload [maxNumberOfFiles]="1" accept=".jpg,.tif,.png,.bmp"></app-file-upload>
											<mat-error
												class="mat-option-error"
												*ngIf="
													(form.get('documentPhoto')?.dirty || form.get('documentPhoto')?.touched) &&
													form.get('documentPhoto')?.invalid &&
													form.get('documentPhoto')?.hasError('required')
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
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class CitizenshipComponent {
	maxDate = new Date();

	genderTypes = GenderTypes;
	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.formBuilder.group({
		isBornInCanada: new FormControl(''),
		proofOfCitizenship: new FormControl(''),
		proofOfAbility: new FormControl(''),
		documentExpiryDate: new FormControl(''),
		documentPhoto: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}

	get isBornInCanada(): FormControl {
		return this.form.get('isBornInCanada') as FormControl;
	}
}
