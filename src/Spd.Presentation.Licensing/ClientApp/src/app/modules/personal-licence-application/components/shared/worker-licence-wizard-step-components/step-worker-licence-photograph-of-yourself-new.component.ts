import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { LicenceApplicationService } from '@app/core/services/licence-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { CommonPhotographOfYourselfComponent } from '@app/modules/personal-licence-application/components/shared/common-step-components/common-photograph-of-yourself.component';

@Component({
	selector: 'app-step-worker-licence-photograph-of-yourself-new',
	template: `
		<app-step-section title="Upload a photo of yourself">
			<app-common-photograph-of-yourself
				[form]="form"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
			></app-common-photograph-of-yourself>
		</app-step-section>
	`,
	styles: [],
})
export class StepWorkerLicencePhotographOfYourselfNewComponent implements LicenceChildStepperStepComponent {
	@Input() form!: FormGroup;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(CommonPhotographOfYourselfComponent)
	commonPhotographOfYourselfComponent!: CommonPhotographOfYourselfComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	onFileUploaded(file: File): void {
		this.licenceApplicationService.hasValueChanged = true;

		if (!this.licenceApplicationService.isAutoSave()) {
			return;
		}

		this.licenceApplicationService.addUploadDocument(LicenceDocumentTypeCode.PhotoOfYourself, file).subscribe({
			next: (resp: any) => {
				const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
				matchingFile.documentUrlId = resp.body[0].documentUrlId;
			},
			error: (error: any) => {
				console.log('An error occurred during file upload', error);

				this.commonPhotographOfYourselfComponent.fileUploadComponent.removeFailedFile(file);
			},
		});
	}

	onFileRemoved(): void {
		this.licenceApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}