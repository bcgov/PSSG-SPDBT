import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';

@Component({
	selector: 'app-step-team-medical-info',
	template: `
		<app-step-section
			title="Medical Information"
			subtitle="Confirm your need of a guide or service dog by providing a medical form."
		>
			<form [formGroup]="form" novalidate>
				<div class="row my-2">
					<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<app-alert type="info" icon="info">
							Download the
							<a class="large" [href]="medicalFormUrl" target="_blank"
								>Medical Form Confirming Requirement for Guide Dog or Service Dog</a
							>.
						</app-alert>

						<div class="col-xxl-6 col-xl-7 col-lg-7 col-md-10 col-sm-12 mx-auto">
							<div class="text-minor-heading lh-base mb-2">Is your doctor sending the medical form?</div>
						</div>

						<div class="col-xxl-3 col-xl-3 col-lg-4 col-md-4 col-sm-12 mx-auto">
							<mat-radio-group aria-label="Select an option" formControlName="doctorIsProvidingNeedDogMedicalForm">
								<div class="d-flex justify-content-start">
									<mat-radio-button class="w-auto radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-radio-button class="w-auto radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</div>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('doctorIsProvidingNeedDogMedicalForm')?.dirty ||
										form.get('doctorIsProvidingNeedDogMedicalForm')?.touched) &&
									form.get('doctorIsProvidingNeedDogMedicalForm')?.invalid &&
									form.get('doctorIsProvidingNeedDogMedicalForm')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>

						<div
							*ngIf="doctorIsProvidingNeedDogMedicalForm.value === booleanTypeCodes.No"
							@showHideTriggerSlideAnimation
						>
							<mat-divider class="mt-3 mat-divider-primary"></mat-divider>

							<div class="text-minor-heading lh-base mt-3 mb-2">
								Upload Medical Form Confirming Requirement for Guide Dog or Service Dog. Exam date must be within last 6
								months.
							</div>

							<app-file-upload
								(fileUploaded)="onFileUploaded($event)"
								(fileRemoved)="onFileRemoved()"
								[control]="attachments"
								[maxNumberOfFiles]="10"
								[files]="attachments.value"
								[previewImage]="true"
								ariaFileUploadLabel="Upload medical form confirming requirement for Guide Dog or Service Dog"
							></app-file-upload>
							<mat-error
								class="mt-3 mat-option-error"
								*ngIf="
									(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
									form.get('attachments')?.invalid &&
									form.get('attachments')?.hasError('required')
								"
							>
								<app-alert type="danger" icon="dangerous">
									This is required. You must have a Medical Form confirming requirement for Guide Dog or Service Dog.
								</app-alert>
							</mat-error>
						</div>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class StepTeamMedicalInfoComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	medicalFormUrl = SPD_CONSTANTS.urls.medicalFormUrl;

	form: FormGroup = this.gdsdTeamApplicationService.medicalInformationFormGroup;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	onFileUploaded(file: File): void {
		this.gdsdTeamApplicationService.fileUploaded(
			LicenceDocumentTypeCode.MedicalFormConfirmingNeedDog,
			file,
			this.attachments,
			this.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.gdsdTeamApplicationService.fileRemoved();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
	get doctorIsProvidingNeedDogMedicalForm(): FormControl {
		return this.form.get('doctorIsProvidingNeedDogMedicalForm') as FormControl;
	}
}
