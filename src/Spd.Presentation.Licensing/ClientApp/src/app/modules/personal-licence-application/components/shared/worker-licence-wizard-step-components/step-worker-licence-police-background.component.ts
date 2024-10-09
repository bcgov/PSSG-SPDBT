import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { FormPoliceBackgroundComponent } from '@app/shared/components/form-police-background.component';

@Component({
	selector: 'app-step-worker-licence-police-background',
	template: `
		<app-step-section [title]="title">
			<app-form-police-background
				[form]="form"
				[isWizardStep]="true"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
			></app-form-police-background>
		</app-step-section>
	`,
	styles: [],
})
export class StepWorkerLicencePoliceBackgroundComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	form: FormGroup = this.workerApplicationService.policeBackgroundFormGroup;

	@ViewChild(FormPoliceBackgroundComponent)
	formPoliceBackgroundComponent!: FormPoliceBackgroundComponent;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	ngOnInit(): void {
		this.title = this.workerApplicationService.getPoliceBackgroundTitle(this.applicationTypeCode);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileUploaded(file: File): void {
		this.workerApplicationService.fileUploaded(
			LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
			file,
			this.formPoliceBackgroundComponent.attachments,
			this.formPoliceBackgroundComponent.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.workerApplicationService.fileRemoved();
	}
}
