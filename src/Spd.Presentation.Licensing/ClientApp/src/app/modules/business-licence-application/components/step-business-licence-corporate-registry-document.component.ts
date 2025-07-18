import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';

@Component({
	selector: 'app-step-business-licence-corporate-registry-document',
	template: `
		<app-step-section heading="Upload corporate registry documents">
		  <div class="row">
		    <div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
		      <div class="text-minor-heading lh-base mb-2">
		        Upload a copy of the corporate registry documents for your business in the province in which you are
		        originally registered
		      </div>
		      <app-file-upload
		        (fileUploaded)="onFileUploaded($event)"
		        (fileRemoved)="onFileRemoved()"
		        [control]="attachments"
		        [maxNumberOfFiles]="10"
		        [files]="attachments.value"
		      ></app-file-upload>
		      @if (
		        (form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
		        form.get('attachments')?.invalid &&
		        form.get('attachments')?.hasError('required')
		        ) {
		        <mat-error
		          class="mat-option-error d-block"
		          >This is required</mat-error
		          >
		        }
		      </div>
		    </div>
		  </app-step-section>
		`,
	styles: [],
	standalone: false,
})
export class StepBusinessLicenceCorporateRegistryDocumentComponent implements LicenceChildStepperStepComponent {
	form = this.businessApplicationService.corporateRegistryDocumentFormGroup;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileUploaded(file: File): void {
		this.businessApplicationService.hasValueChanged = true;

		if (!this.businessApplicationService.isAutoSave()) {
			return;
		}

		this.businessApplicationService
			.addUploadDocument(LicenceDocumentTypeCode.CorporateRegistryDocument, file)
			.subscribe({
				next: (resp: any) => {
					const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
					matchingFile.documentUrlId = resp.body[0].documentUrlId;
				},
				error: (error: any) => {
					console.log('An error occurred during file upload', error);
					this.fileUploadComponent.removeFailedFile(file);
				},
			});
	}

	onFileRemoved(): void {
		this.businessApplicationService.hasValueChanged = true;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
	get attachmentIsRequired(): FormControl {
		return this.form.get('attachmentIsRequired') as FormControl;
	}
}
