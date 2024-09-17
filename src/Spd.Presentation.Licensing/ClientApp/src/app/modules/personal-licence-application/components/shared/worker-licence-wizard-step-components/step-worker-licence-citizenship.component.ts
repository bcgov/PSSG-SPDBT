import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { FormSwlCitizenshipComponent } from '@app/shared/components/form-swl-citizenship.component';

@Component({
	selector: 'app-step-worker-licence-citizenship',
	template: `
		<app-step-section [title]="title">
			<app-form-swl-citizenship
				[applicationTypeCode]="applicationTypeCode"
				[form]="form"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
				(fileGovernmentIssuedUploaded)="onFileGovernmentIssuedUploaded($event)"
				(fileGovernmentIssuedRemoved)="onFileGovernmentIssuedRemoved()"
			></app-form-swl-citizenship>
		</app-step-section>
	`,
	styles: [],
})
export class StepWorkerLicenceCitizenshipComponent implements OnInit, LicenceChildStepperStepComponent {
	title = 'Are you a Canadian citizen?';

	form: FormGroup = this.workerApplicationService.citizenshipFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(FormSwlCitizenshipComponent) formSwlCitizenshipComponent!: FormSwlCitizenshipComponent;

	constructor(private workerApplicationService: WorkerApplicationService, private utilService: UtilService) {}

	ngOnInit(): void {
		if (this.applicationTypeCode === ApplicationTypeCode.Renewal) {
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

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
