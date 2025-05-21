import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { FormSwlCitizenshipComponent } from '@app/shared/components/form-swl-citizenship.component';

@Component({
	selector: 'app-step-worker-licence-citizenship',
	template: `
		<app-step-section [title]="title">
			<app-form-swl-citizenship
				[applicationTypeCode]="applicationTypeCode"
				[form]="form"
				[showFullCitizenshipQuestion]="showFullCitizenshipQuestion"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
				(filesCleared)="onFilesCleared()"
				(fileGovernmentIssuedUploaded)="onFileGovernmentIssuedUploaded($event)"
				(fileGovernmentIssuedRemoved)="onFileGovernmentIssuedRemoved()"
				(fileGovernmentIssuedCleared)="onFilesGovernmentIssuedCleared()"
			></app-form-swl-citizenship>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepWorkerLicenceCitizenshipComponent implements OnInit, LicenceChildStepperStepComponent {
	title = 'Are you a Canadian citizen?';

	form: FormGroup = this.workerApplicationService.citizenshipFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() showFullCitizenshipQuestion = true;
	@Input() showNonCanadianCitizenshipQuestion = false;

	@ViewChild(FormSwlCitizenshipComponent) formSwlCitizenshipComponent!: FormSwlCitizenshipComponent;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	ngOnInit(): void {
		if (this.showNonCanadianCitizenshipQuestion && this.applicationTypeCode === ApplicationTypeCode.Renewal) {
			this.title = 'Provide proof of ability to work in Canada';
		}
	}

	onFileUploaded(file: File): void {
		this.workerApplicationService.fileUploaded(
			this.formSwlCitizenshipComponent.getProofTypeCode(),
			file,
			this.formSwlCitizenshipComponent.attachments,
			this.formSwlCitizenshipComponent.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.workerApplicationService.fileRemoved();
	}

	onFilesCleared(): void {
		this.attachments.setValue([]);
	}

	onFileGovernmentIssuedUploaded(file: File): void {
		this.workerApplicationService.fileUploaded(
			this.formSwlCitizenshipComponent.getGovernmentIssuedProofTypeCode(),
			file,
			this.formSwlCitizenshipComponent.governmentIssuedAttachments,
			this.formSwlCitizenshipComponent.governmentIssuedFileUploadComponent
		);
	}

	onFileGovernmentIssuedRemoved(): void {
		this.workerApplicationService.fileRemoved();
	}

	onFilesGovernmentIssuedCleared(): void {
		this.governmentIssuedAttachments.setValue([]);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
	get governmentIssuedAttachments(): FormControl {
		return this.form.get('governmentIssuedAttachments') as FormControl;
	}
}
