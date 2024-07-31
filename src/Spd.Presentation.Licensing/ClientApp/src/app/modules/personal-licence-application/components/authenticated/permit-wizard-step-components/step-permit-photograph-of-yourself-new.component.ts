import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { CommonPhotographOfYourselfComponent } from '@app/modules/personal-licence-application/components/shared/common-step-components/common-photograph-of-yourself.component';
import { PermitApplicationService } from '@app/modules/personal-licence-application/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-permit-photograph-of-yourself-new',
	template: `
		<app-step-section title="Upload a photo of yourself">
			<app-common-photograph-of-yourself
				[form]="form"
				name="permit"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
			></app-common-photograph-of-yourself>
		</app-step-section>
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
