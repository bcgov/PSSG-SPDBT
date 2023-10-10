import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BooleanTypeCode } from 'src/app/api/models';
import { showHideTriggerAnimation, showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import {
	LicenceApplicationService,
	LicenceFormStepComponent,
	LicenceModelSubject,
} from '../licence-application.service';

@Component({
	selector: 'app-dogs-or-restraints',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="Do you want to request authorization to use dogs or restraints?"></app-step-title>
				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="useDogsOrRestraints">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('useDogsOrRestraints')?.dirty || form.get('useDogsOrRestraints')?.touched) &&
										form.get('useDogsOrRestraints')?.invalid &&
										form.get('useDogsOrRestraints')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>

						<div
							class="row mt-4"
							*ngIf="useDogsOrRestraints.value == booleanTypeCodes.Yes"
							@showHideTriggerSlideAnimation
						>
							<div class="offset-md-2 col-md-8 col-sm-12">
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

								<div class="row mt-2">
									<div class="col-12">
										<mat-checkbox formControlName="carryAndUseRetraints">
											<mat-label class="fw-semibold fs-6"
												>I request authorization to carry and use restraints</mat-label
											>
										</mat-checkbox>
									</div>
								</div>

								<div *ngIf="carryAndUseRetraints.value == true" @showHideTriggerAnimation>
									<div class="text-minor-heading my-2">Document type:</div>
									<mat-radio-group
										class="category-radio-group"
										aria-label="Select an option"
										formControlName="carryAndUseRetraintsDocument"
									>
										<mat-radio-button class="radio-label" value="a">
											Advanced security training (AST) certificate
										</mat-radio-button>
										<mat-divider class="my-2"></mat-divider>
										<mat-radio-button class="radio-label" value="b">
											A Canadian police officer, correctional officer, sheriff, auxiliary, reserve or border service
											officer can provide a letter from their employer showing use of force training within the last 12
											months.
										</mat-radio-button>
										<mat-divider class="my-2"></mat-divider>
										<mat-radio-button class="radio-label" value="c">
											Must be able to demonstrate, to the satisfaction of the registrar that he or she has training
											equivalent to the training referred above.
										</mat-radio-button>
									</mat-radio-group>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(form.get('carryAndUseRetraintsDocument')?.dirty ||
												form.get('carryAndUseRetraintsDocument')?.touched) &&
											form.get('carryAndUseRetraintsDocument')?.invalid &&
											form.get('carryAndUseRetraintsDocument')?.hasError('required')
										"
										>This is required</mat-error
									>

									<div class="text-minor-heading mt-4 mb-2">Upload your proof of qualification</div>

									<div class="my-2">
										<app-file-upload [maxNumberOfFiles]="10" #carryAndUseRetraintsAttachments></app-file-upload>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('carryAndUseRetraintsAttachments')?.dirty ||
													form.get('carryAndUseRetraintsAttachments')?.touched) &&
												form.get('carryAndUseRetraintsAttachments')?.invalid &&
												form.get('carryAndUseRetraintsAttachments')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
								</div>

								<mat-divider class="my-4"></mat-divider>

								<div class="row mt-2">
									<div class="col-12">
										<div class="form-group" formGroupName="dogPurposeFormGroup">
											<mat-label class="fw-semibold">I request authorization to use dogs for the purpose of</mat-label>
											<mat-checkbox formControlName="isDogsPurposeProtection"> Protection </mat-checkbox>
											<mat-checkbox formControlName="isDogsPurposeDetectionDrugs"> Detection - Drugs </mat-checkbox>
											<mat-checkbox formControlName="isDogsPurposeDetectionExplosives">
												Detection - Explosives
											</mat-checkbox>
											<mat-error
												class="mat-option-error"
												*ngIf="
													(form.get('dogPurposeFormGroup')?.dirty || form.get('dogPurposeFormGroup')?.touched) &&
													form.get('dogPurposeFormGroup')?.invalid &&
													form.get('dogPurposeFormGroup')?.hasError('atLeastOneCheckboxValidator')
												"
												>At least one option must be selected</mat-error
											>
										</div>
									</div>
								</div>

								<div *ngIf="isDogPurposesGroup == true" @showHideTriggerAnimation>
									<div class="text-minor-heading my-2">Document type:</div>
									<mat-radio-group
										class="category-radio-group"
										aria-label="Select an option"
										formControlName="dogsPurposeDocumentType"
									>
										<mat-radio-button class="radio-label" value="a">
											Security Dog Validation Certificate
										</mat-radio-button>
										<mat-divider class="my-2"></mat-divider>
										<mat-radio-button class="radio-label" value="b">
											Certificate of Advanced Security Training
										</mat-radio-button>
									</mat-radio-group>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(form.get('dogsPurposeDocumentType')?.dirty || form.get('dogsPurposeDocumentType')?.touched) &&
											form.get('dogsPurposeDocumentType')?.invalid &&
											form.get('dogsPurposeDocumentType')?.hasError('required')
										"
										>This is required</mat-error
									>

									<!-- Your Security Dog Validation Certificate has expired. Please upload your new proof of qualification. -->

									<div class="text-minor-heading mt-4 mb-2">Upload your proof of qualification</div>

									<div class="my-2">
										<app-file-upload [maxNumberOfFiles]="10" #dogsPurposeAttachments></app-file-upload>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('dogsPurposeAttachments')?.dirty || form.get('dogsPurposeAttachments')?.touched) &&
												form.get('dogsPurposeAttachments')?.invalid &&
												form.get('dogsPurposeAttachments')?.hasError('required')
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
	animations: [showHideTriggerAnimation, showHideTriggerSlideAnimation],
})
export class DogsOrRestraintsComponent implements OnInit, OnDestroy, LicenceFormStepComponent {
	private licenceModelLoadedSubscription!: Subscription;

	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.formBuilder.group(
		{
			useDogsOrRestraints: new FormControl('', [FormControlValidators.required]),
			carryAndUseRetraints: new FormControl(),
			carryAndUseRetraintsDocument: new FormControl(),
			carryAndUseRetraintsAttachments: new FormControl(),
			dogPurposeFormGroup: new FormGroup(
				{
					isDogsPurposeProtection: new FormControl(false),
					isDogsPurposeDetectionDrugs: new FormControl(false),
					isDogsPurposeDetectionExplosives: new FormControl(false),
				},
				FormGroupValidators.atLeastOneCheckboxValidator('useDogsOrRestraints', BooleanTypeCode.Yes)
			),
			dogsPurposeDocumentType: new FormControl(),
			dogsPurposeAttachments: new FormControl(),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'carryAndUseRetraintsDocument',
					(form) =>
						form.get('useDogsOrRestraints')?.value == this.booleanTypeCodes.Yes &&
						form.get('carryAndUseRetraints')?.value
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'carryAndUseRetraintsAttachments',
					(form) =>
						form.get('useDogsOrRestraints')?.value == this.booleanTypeCodes.Yes &&
						form.get('carryAndUseRetraints')?.value
				),
				FormGroupValidators.conditionalDefaultRequiredValidator('dogsPurposeDocumentType', (form) => {
					const dogPurposeFormGroup = form.get('dogPurposeFormGroup') as FormGroup;
					return (
						form.get('useDogsOrRestraints')?.value == this.booleanTypeCodes.Yes &&
						((dogPurposeFormGroup.get('isDogsPurposeProtection') as FormControl).value ||
							(dogPurposeFormGroup.get('isDogsPurposeDetectionDrugs') as FormControl).value ||
							(dogPurposeFormGroup.get('isDogsPurposeDetectionExplosives') as FormControl).value)
					);
				}),
				FormGroupValidators.conditionalDefaultRequiredValidator('dogsPurposeAttachments', (form) => {
					const dogPurposeFormGroup = form.get('dogPurposeFormGroup') as FormGroup;
					return (
						form.get('useDogsOrRestraints')?.value == this.booleanTypeCodes.Yes &&
						((dogPurposeFormGroup.get('isDogsPurposeProtection') as FormControl).value ||
							(dogPurposeFormGroup.get('isDogsPurposeDetectionDrugs') as FormControl).value ||
							(dogPurposeFormGroup.get('isDogsPurposeDetectionExplosives') as FormControl).value)
					);
				}),
			],
		}
	);

	@ViewChild('carryAndUseRetraintsAttachments') fileUploadComponent1!: FileUploadComponent;
	@ViewChild('dogsPurposeAttachments') fileUploadComponent2!: FileUploadComponent;

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: LicenceModelSubject) => {
				if (loaded.isLoaded) {
					this.form.patchValue({
						useDogsOrRestraints: this.licenceApplicationService.licenceModel.useDogsOrRestraints,
						carryAndUseRetraints: this.licenceApplicationService.licenceModel.carryAndUseRetraints,
						carryAndUseRetraintsDocument: this.licenceApplicationService.licenceModel.carryAndUseRetraintsDocument,
						carryAndUseRetraintsAttachments:
							this.licenceApplicationService.licenceModel.carryAndUseRetraintsAttachments,
						dogPurposeFormGroup: {
							isDogsPurposeProtection: this.licenceApplicationService.licenceModel.isDogsPurposeProtection,
							isDogsPurposeDetectionDrugs: this.licenceApplicationService.licenceModel.isDogsPurposeDetectionDrugs,
							isDogsPurposeDetectionExplosives:
								this.licenceApplicationService.licenceModel.isDogsPurposeDetectionExplosives,
						},
						dogsPurposeDocumentType: this.licenceApplicationService.licenceModel.dogsPurposeDocumentType,
						dogsPurposeAttachments: this.licenceApplicationService.licenceModel.dogsPurposeAttachments,
					});
				}
			},
		});
	}

	ngOnDestroy() {
		this.licenceModelLoadedSubscription.unsubscribe();
	}

	isFormValid(): boolean {
		const attachments1 =
			this.fileUploadComponent1?.files && this.fileUploadComponent1?.files.length > 0
				? this.fileUploadComponent1.files
				: '';
		this.form.controls['carryAndUseRetraintsAttachments'].setValue(attachments1);

		const attachments2 =
			this.fileUploadComponent2?.files && this.fileUploadComponent2?.files.length > 0
				? this.fileUploadComponent2.files
				: '';
		this.form.controls['dogsPurposeAttachments'].setValue(attachments2);

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getDataToSave(): any {
		// flatten the 'dogPurposeFormGroup' data
		let formValue = this.form.value;
		formValue = { ...formValue, ...formValue.dogPurposeFormGroup };
		delete formValue.dogPurposeFormGroup;

		// remove any invalid data
		if (this.useDogsOrRestraints.value == this.booleanTypeCodes.No) {
			formValue = {
				...formValue,
				...{
					carryAndUseRetraints: null,
					carryAndUseRetraintsDocument: null,
					carryAndUseRetraintsAttachments: null,
					isDogsPurposeProtection: false,
					isDogsPurposeDetectionDrugs: false,
					isDogsPurposeDetectionExplosives: false,
					dogsPurposeDocumentType: null,
					dogsPurposeAttachments: null,
				},
			};
		}

		return formValue;
	}

	get useDogsOrRestraints(): FormControl {
		return this.form.get('useDogsOrRestraints') as FormControl;
	}

	get carryAndUseRetraints(): FormControl {
		return this.form.get('carryAndUseRetraints') as FormControl;
	}

	get isDogPurposesGroup(): boolean {
		const dogPurposeFormGroup = this.form.get('dogPurposeFormGroup') as FormGroup;
		return (
			(dogPurposeFormGroup.get('isDogsPurposeProtection') as FormControl).value ||
			(dogPurposeFormGroup.get('isDogsPurposeDetectionDrugs') as FormControl).value ||
			(dogPurposeFormGroup.get('isDogsPurposeDetectionExplosives') as FormControl).value
		);
	}
}
