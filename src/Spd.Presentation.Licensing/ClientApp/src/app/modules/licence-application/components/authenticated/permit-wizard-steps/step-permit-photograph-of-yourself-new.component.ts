import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { CommonPhotographOfYourselfComponent } from '../../shared/step-components/common-photograph-of-yourself.component';

@Component({
	selector: 'app-step-permit-photograph-of-yourself-new',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Upload a photo of yourself"></app-step-title>

				<app-common-photograph-of-yourself
					[form]="form"
					name="permit"
					(fileUploaded)="onFileUploaded($event)"
					(fileRemoved)="onFileRemoved()"
				></app-common-photograph-of-yourself>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitPhotographOfYourselfNewComponent implements LicenceChildStepperStepComponent {
	@Input() form!: FormGroup;

	@ViewChild(CommonPhotographOfYourselfComponent)
	commonPhotographOfYourselfComponent!: CommonPhotographOfYourselfComponent;

	constructor(private permitApplicationService: PermitApplicationService) {}

	onFileUploaded(file: File): void {
		this.permitApplicationService.hasValueChanged = true;

		if (!this.permitApplicationService.isAutoSave()) {
			return;
		}

		this.permitApplicationService.addUploadDocument(LicenceDocumentTypeCode.PhotoOfYourself, file).subscribe({
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
		this.permitApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
