import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BooleanTypeCode } from 'src/app/api/models';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import {
	LicenceApplicationService,
	LicenceFormStepComponent,
	LicenceModelSubject,
} from '../licence-application.service';

@Component({
	selector: 'app-mental-health-conditions',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="Have you been treated for any of the following Mental Health Conditions?"
					subtitle="An individual applying for a security worker licence must provide particulars of any mental health condition for which the individual has received treatment"
				></app-step-title>
				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="isTreatedForMHC">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('isTreatedForMHC')?.dirty || form.get('isTreatedForMHC')?.touched) &&
										form.get('isTreatedForMHC')?.invalid &&
										form.get('isTreatedForMHC')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>

						<div class="row my-4" *ngIf="isTreatedForMHC.value == booleanTypeCodes.Yes">
							<div class="offset-md-2 col-md-8 col-sm-12">
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
								<p>
									If you don't have a completed form, you can download and provide it to your physician to fill out, or
									your physician may download it and fill the form out on a computer if you provide them with the
									required information. See the
									<a href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/07030_01" target="_blank">
										Security Services Act </a
									>, s. 3, Security Services Regulation, s. 4(1)(e) for more information
								</p>
								<div class="row mt-2">
									<div class="col-12">
										<div class="text-minor-heading mb-2">Upload your mental health condition form:</div>
										<app-file-upload
											[maxNumberOfFiles]="1"
											[files]="mentalHealthConditionAttachments.value"
										></app-file-upload>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('mentalHealthConditionAttachments')?.dirty ||
													form.get('mentalHealthConditionAttachments')?.touched) &&
												form.get('mentalHealthConditionAttachments')?.invalid &&
												form.get('mentalHealthConditionAttachments')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class MentalHealthConditionsComponent implements OnInit, OnDestroy, LicenceFormStepComponent {
	private licenceModelLoadedSubscription!: Subscription;

	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.licenceApplicationService.mentalHealthConditionsFormGroup;
	//  this.formBuilder.group(
	// 	{
	// 		isTreatedForMHC: new FormControl(null, [FormControlValidators.required]),
	// 		mentalHealthConditionAttachments: new FormControl(),
	// 	},
	// 	{
	// 		validators: [
	// 			FormGroupValidators.conditionalDefaultRequiredValidator(
	// 				'mentalHealthConditionAttachments',
	// 				(form) => form.get('isTreatedForMHC')?.value == BooleanTypeCode.Yes
	// 			),
	// 		],
	// 	}
	// );

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: LicenceModelSubject) => {
				if (loaded.isLoaded) {
					// this.form.patchValue({
					// 	isTreatedForMHC: this.licenceApplicationService.licenceModel.isTreatedForMHC,
					// 	mentalHealthConditionAttachments:
					// 		this.licenceApplicationService.licenceModel.mentalHealthConditionAttachments,
					// });
				}
			},
		});
	}

	ngOnDestroy() {
		this.licenceModelLoadedSubscription.unsubscribe();
	}

	isFormValid(): boolean {
		const attachments =
			this.fileUploadComponent?.files && this.fileUploadComponent?.files.length > 0
				? this.fileUploadComponent.files
				: '';
		this.form.controls['mentalHealthConditionAttachments'].setValue(attachments);

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getDataToSave(): any {
		return this.form.value;
	}

	get isTreatedForMHC(): FormControl {
		return this.form.get('isTreatedForMHC') as FormControl;
	}

	get mentalHealthConditionAttachments(): FormControl {
		return this.form.get('mentalHealthConditionAttachments') as FormControl;
	}
}
