import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { showHideTriggerAnimation, showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { DogDocumentTypes, RestraintDocumentTypes } from 'src/app/core/code-types/model-desc.models';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

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
										<ng-container *ngFor="let doc of restraintDocumentTypes; let i = index; let last = last">
											<mat-radio-button class="radio-label" [value]="doc.code">
												{{ doc.desc }}
											</mat-radio-button>
											<mat-divider *ngIf="!last" class="my-2"></mat-divider>
										</ng-container>
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

									<div class="text-minor-heading mt-4 mb-2">Upload your proof of qualification:</div>

									<div class="my-2">
										<app-file-upload
											[maxNumberOfFiles]="10"
											[files]="carryAndUseRetraintsAttachments.value"
											#carryAndUseRetraintsAttachmentsRef
											(filesChanged)="onRestraintsFilesChanged()"
										></app-file-upload>
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
										<ng-container *ngFor="let doc of dogDocumentTypes; let i = index; let last = last">
											<mat-radio-button class="radio-label" [value]="doc.code">
												{{ doc.desc }}
											</mat-radio-button>
											<mat-divider *ngIf="!last" class="my-2"></mat-divider>
										</ng-container>
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

									<div class="text-minor-heading mt-4 mb-2">Upload your proof of qualification:</div>

									<div class="my-2">
										<app-file-upload
											[maxNumberOfFiles]="10"
											[files]="dogsPurposeAttachments.value"
											#dogsPurposeAttachmentsRef
											(filesChanged)="onDogFilesChanged()"
										></app-file-upload>
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
export class DogsOrRestraintsComponent implements LicenceFormStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	restraintDocumentTypes = RestraintDocumentTypes;
	dogDocumentTypes = DogDocumentTypes;

	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.licenceApplicationService.dogsOrRestraintsFormGroup;

	@ViewChild('carryAndUseRetraintsAttachmentsRef') fileUploadComponent1!: FileUploadComponent;
	@ViewChild('dogsPurposeAttachmentsRef') fileUploadComponent2!: FileUploadComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.onRestraintsFilesChanged();
		this.onDogFilesChanged();

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onRestraintsFilesChanged(): void {
		const attachments =
			this.fileUploadComponent1?.files && this.fileUploadComponent1?.files.length > 0
				? this.fileUploadComponent1.files
				: [];
		this.form.controls['carryAndUseRetraintsAttachments'].setValue(attachments);
	}

	onDogFilesChanged(): void {
		const attachments =
			this.fileUploadComponent2?.files && this.fileUploadComponent2?.files.length > 0
				? this.fileUploadComponent2.files
				: [];
		this.form.controls['dogsPurposeAttachments'].setValue(attachments);
	}

	get useDogsOrRestraints(): FormControl {
		return this.form.get('useDogsOrRestraints') as FormControl;
	}

	get carryAndUseRetraints(): FormControl {
		return this.form.get('carryAndUseRetraints') as FormControl;
	}

	get carryAndUseRetraintsAttachments(): FormControl {
		return this.form.get('carryAndUseRetraintsAttachments') as FormControl;
	}

	get dogsPurposeAttachments(): FormControl {
		return this.form.get('dogsPurposeAttachments') as FormControl;
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
