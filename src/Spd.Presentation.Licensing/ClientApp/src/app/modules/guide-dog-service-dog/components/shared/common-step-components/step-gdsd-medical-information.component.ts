import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';

@Component({
	selector: 'app-step-gdsd-medical-information',
	template: `
		<app-step-section
			title="Medical Information"
			subtitle="Confirm your need of a guide or service dog by providing a medical form."
		>
			<form [formGroup]="form" novalidate>
				<div class="row my-2">
					<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<app-alert type="info" icon="info">
							Download
							<a
								class="large"
								href="https://www2.gov.bc.ca/assets/gov/law-crime-and-justice/human-rights/guide-animals/spd0803-medical-form.pdf"
								target="_blank"
								>medical form confirming requirement for guide dog or service dog</a
							>.
						</app-alert>

						<div class="fs-5 lh-base mt-3 mb-2">
							Upload Medical Form Confirming Requirement for Guide Dog or Service Dog Exam date must be within last 6
							months.
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
								This is required. You must have a Medical Form confirming requirement for Guide Dog or Service Dog.
							</app-alert>
						</mat-error>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepGdsdMedicalInformationComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.gdsdApplicationService.medicalInformationFormGroup;

	@Output() fileUploaded = new EventEmitter<File>();
	@Output() fileRemoved = new EventEmitter();

	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	onFileUploaded(file: File): void {
		this.fileUploaded.emit(file);
	}

	onFileRemoved(): void {
		this.fileRemoved.emit();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
