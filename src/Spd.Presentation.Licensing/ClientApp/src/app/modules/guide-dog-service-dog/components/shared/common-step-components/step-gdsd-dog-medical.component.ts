import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';

@Component({
	selector: 'app-step-gdsd-dog-medical',
	template: `
		<app-step-section title="Dog Medical Information">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="fs-5 lh-base mt-3 mb-2">
								Are your dog's inoculations (rabies, distemper, parvovirus) up-to-date?
							</div>

							<div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="areInoculationsUpToDate">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('areInoculationsUpToDate')?.dirty || form.get('areInoculationsUpToDate')?.touched) &&
										form.get('areInoculationsUpToDate')?.invalid &&
										form.get('areInoculationsUpToDate')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>

							<div class="text-minor-heading mt-3">
								<app-alert type="warning" icon="warning">
									Your dog must be spayed or neutered to be certified.
								</app-alert>
							</div>

							<div class="text-minor-heading mb-2">
								Attach certification from a BC veterinarian or equivalent that my dog has been spayed or neutered
							</div>
							<app-file-upload
								(fileUploaded)="onFileUploaded($event)"
								(fileRemoved)="onFileRemoved()"
								[control]="attachments"
								[maxNumberOfFiles]="10"
								[files]="attachments.value"
								[previewImage]="true"
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
									This is required. Your dog must be spayed or neutered to be certified.
								</app-alert>
							</mat-error>
						</div>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepGdsdDogMedicalComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.gdsdApplicationService.dogMedicalFormGroup;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	onFileUploaded(file: File): void {
		this.gdsdApplicationService.fileUploaded(
			LicenceDocumentTypeCode.VeterinarianConfirmationForSpayedNeuteredDog,
			file,
			this.attachments,
			this.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.gdsdApplicationService.fileRemoved();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
