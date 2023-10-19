import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { showHideTriggerAnimation, showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { DogDocumentTypes } from 'src/app/core/code-types/model-desc.models';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-dogs',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="Do you want to request authorization to use dogs?"></app-step-title>
				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="useDogs">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('useDogs')?.dirty || form.get('useDogs')?.touched) &&
										form.get('useDogs')?.invalid &&
										form.get('useDogs')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>

						<div class="row mt-4" *ngIf="useDogs.value == booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
							<div class="offset-md-2 col-md-8 col-sm-12">
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

								<div class="row mt-2">
									<div class="col-12">
										<div class="form-group" formGroupName="dogsPurposeFormGroup">
											<div class="text-minor-heading my-2">I request authorization to use dogs for the purpose of:</div>
											<mat-checkbox formControlName="isDogsPurposeProtection"> Protection </mat-checkbox>
											<mat-checkbox formControlName="isDogsPurposeDetectionDrugs"> Detection - Drugs </mat-checkbox>
											<mat-checkbox formControlName="isDogsPurposeDetectionExplosives">
												Detection - Explosives
											</mat-checkbox>
											<mat-error
												class="mat-option-error"
												*ngIf="
													(form.get('dogsPurposeFormGroup')?.dirty || form.get('dogsPurposeFormGroup')?.touched) &&
													form.get('dogsPurposeFormGroup')?.invalid &&
													form.get('dogsPurposeFormGroup')?.hasError('atLeastOneCheckboxValidator')
												"
												>At least one option must be selected</mat-error
											>
										</div>
									</div>
								</div>

								<div class="text-minor-heading my-2">Document type:</div>
								<mat-radio-group
									class="category-radio-group"
									aria-label="Select an option"
									formControlName="dogsPurposeDocumentType"
								>
									<ng-container *ngFor="let doc of dogDocumentTypes; let i = index">
										<mat-radio-button class="radio-label" [value]="doc.code">
											{{ doc.desc }}
										</mat-radio-button>
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
										[files]="attachments.value"
										(filesChanged)="onDogFilesChanged()"
									></app-file-upload>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
											form.get('attachments')?.invalid &&
											form.get('attachments')?.hasError('required')
										"
										>This is required</mat-error
									>
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
export class DogsComponent implements LicenceFormStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	dogDocumentTypes = DogDocumentTypes;

	form: FormGroup = this.licenceApplicationService.dogsFormGroup;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.onDogFilesChanged();

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onDogFilesChanged(): void {
		const attachments =
			this.fileUploadComponent?.files && this.fileUploadComponent?.files.length > 0
				? this.fileUploadComponent.files
				: [];
		this.form.controls['attachments'].setValue(attachments);
	}

	get useDogs(): FormControl {
		return this.form.get('useDogs') as FormControl;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}

	get isDogPurposesGroup(): boolean {
		const dogsPurposeFormGroup = this.form.get('dogsPurposeFormGroup') as FormGroup;
		return (
			(dogsPurposeFormGroup.get('isDogsPurposeProtection') as FormControl).value ||
			(dogsPurposeFormGroup.get('isDogsPurposeDetectionDrugs') as FormControl).value ||
			(dogsPurposeFormGroup.get('isDogsPurposeDetectionExplosives') as FormControl).value
		);
	}
}
