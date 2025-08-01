import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { FormMentalHealthConditionsComponent } from '@app/shared/components/form-mental-health-conditions.component';

@Component({
	selector: 'app-step-worker-licence-mental-health-conditions',
	template: `
		<app-step-section [heading]="title" [subheading]="subtitle">
			<app-form-mental-health-conditions
				[form]="form"
				[isWizardStep]="true"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
			></app-form-mental-health-conditions>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepWorkerLicenceMentalHealthConditionsComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	form: FormGroup = this.workerApplicationService.mentalHealthConditionsFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(FormMentalHealthConditionsComponent)
	formMentalHealthConditionsComponent!: FormMentalHealthConditionsComponent;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	ngOnInit(): void {
		[this.title, this.subtitle] = this.workerApplicationService.getMentalHealthConditionsTitle(
			this.applicationTypeCode,
			this.workerApplicationService.getIsPreviouslyTreatedForMHC()
		);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileUploaded(file: File): void {
		this.workerApplicationService.fileUploaded(
			LicenceDocumentTypeCode.MentalHealthCondition,
			file,
			this.formMentalHealthConditionsComponent.attachments,
			this.formMentalHealthConditionsComponent.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.workerApplicationService.fileRemoved();
	}
}
