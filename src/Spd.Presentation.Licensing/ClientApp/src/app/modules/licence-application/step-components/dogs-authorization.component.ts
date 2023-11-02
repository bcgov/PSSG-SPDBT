import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { showHideTriggerAnimation, showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { BooleanTypeCode, DogDocumentTypes } from 'src/app/core/code-types/model-desc.models';
import {
	LicenceApplicationService,
	LicenceChildStepperStepComponent,
	LicenceDocumentChanged,
} from '../licence-application.service';

@Component({
	selector: 'app-dogs-authorization',
	template: `
		<section [ngClass]="isCalledFromModal ? 'step-section-modal' : 'step-section p-3'">
			<div class="step">
				<app-step-title
					*ngIf="!isCalledFromModal"
					title="Do you want to request authorization to use dogs?"
				></app-step-title>
				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row" *ngIf="!isCalledFromModal">
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

						<div class="row" *ngIf="useDogs.value == booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
							<div [ngClass]="isCalledFromModal ? 'col-12' : 'offset-md-2 col-md-8 col-sm-12'">
								<mat-divider class="mb-3 mt-4 mat-divider-primary" *ngIf="!isCalledFromModal"></mat-divider>

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
										(filesChanged)="onFilesChanged()"
										[control]="attachments"
										[maxNumberOfFiles]="10"
										[files]="attachments.value"
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
export class DogsAuthorizationComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	dogDocumentTypes = DogDocumentTypes;

	form: FormGroup = this.licenceApplicationService.dogsAuthorizationFormGroup;

	@Input() isCalledFromModal: boolean = false;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		if (this.isCalledFromModal) {
			this.form.patchValue({
				useDogs: BooleanTypeCode.Yes,
			});
		}
	}

	onFilesChanged(): void {
		this.licenceApplicationService.hasDocumentsChanged = LicenceDocumentChanged.dogsAuthorization;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
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
