import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { CommonPhotographOfYourselfComponent } from '@app/modules/licence-application/components/shared/step-components/common-photograph-of-yourself.component';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
	selector: 'app-step-worker-licence-photograph-of-yourself-new',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Upload a photo of yourself"></app-step-title>

				<app-common-photograph-of-yourself
					[form]="form"
					(fileUploaded)="onFileUploaded($event)"
					(fileRemoved)="onFileRemoved()"
				></app-common-photograph-of-yourself>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicencePhotographOfYourselfNewComponent implements LicenceChildStepperStepComponent {
	@Input() form!: FormGroup;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(CommonPhotographOfYourselfComponent)
	commonPhotographOfYourselfComponent!: CommonPhotographOfYourselfComponent;

	constructor(private licenceApplicationService: LicenceApplicationService, private hotToastService: HotToastService) {}

	onFileUploaded(file: File): void {
		this.licenceApplicationService.hasValueChanged = true;

		if (this.licenceApplicationService.isAutoSave()) {
			this.licenceApplicationService.addUploadDocument(LicenceDocumentTypeCode.PhotoOfYourself, file).subscribe({
				next: (resp: any) => {
					const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
					matchingFile.documentUrlId = resp.body[0].documentUrlId;
				},
				error: (error: any) => {
					console.log('An error occurred during file upload', error);
					this.hotToastService.error('An error occurred during the file upload. Please try again.');
					this.commonPhotographOfYourselfComponent.fileUploadComponent.removeFailedFile(file);
				},
			});
		}
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