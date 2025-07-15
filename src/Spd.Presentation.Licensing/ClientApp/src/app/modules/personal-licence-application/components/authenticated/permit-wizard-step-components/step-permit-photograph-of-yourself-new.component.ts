import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode, ServiceTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormPhotographOfYourselfComponent } from '@app/shared/components/form-photograph-of-yourself.component';

@Component({
	selector: 'app-step-permit-photograph-of-yourself-new',
	template: `
		<app-step-section heading="Upload a photo of yourself">
			<app-form-photograph-of-yourself
				[serviceTypeCode]="serviceTypeCode"
				[form]="form"
				serviceTypeLabel="permit"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
			></app-form-photograph-of-yourself>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepPermitPhotographOfYourselfNewComponent implements LicenceChildStepperStepComponent {
	@Input() form!: FormGroup;
	@Input() serviceTypeCode!: ServiceTypeCode;

	@ViewChild(FormPhotographOfYourselfComponent) formPhotographOfYourselfComponent!: FormPhotographOfYourselfComponent;

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

				this.formPhotographOfYourselfComponent.fileUploadComponent.removeFailedFile(file);
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
