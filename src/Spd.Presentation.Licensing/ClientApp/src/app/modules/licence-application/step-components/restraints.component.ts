import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { showHideTriggerAnimation, showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { RestraintDocumentTypes } from 'src/app/core/code-types/model-desc.models';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-restraints',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="Do you want to request authorization to use restraints?"></app-step-title>
				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="carryAndUseRetraints">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('carryAndUseRetraints')?.dirty || form.get('carryAndUseRetraints')?.touched) &&
										form.get('carryAndUseRetraints')?.invalid &&
										form.get('carryAndUseRetraints')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>

						<div
							class="row mt-4"
							*ngIf="carryAndUseRetraints.value == booleanTypeCodes.Yes"
							@showHideTriggerSlideAnimation
						>
							<div class="offset-md-2 col-md-8 col-sm-12">
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

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
										[files]="attachments.value"
										(filesChanged)="onRestraintsFilesChanged()"
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
export class RestraintsComponent implements LicenceFormStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	restraintDocumentTypes = RestraintDocumentTypes;

	form: FormGroup = this.licenceApplicationService.restraintsFormGroup;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.onRestraintsFilesChanged();

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onRestraintsFilesChanged(): void {
		const attachments =
			this.fileUploadComponent?.files && this.fileUploadComponent?.files.length > 0
				? this.fileUploadComponent.files
				: [];
		this.form.controls['attachments'].setValue(attachments);
	}

	get carryAndUseRetraints(): FormControl {
		return this.form.get('carryAndUseRetraints') as FormControl;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
