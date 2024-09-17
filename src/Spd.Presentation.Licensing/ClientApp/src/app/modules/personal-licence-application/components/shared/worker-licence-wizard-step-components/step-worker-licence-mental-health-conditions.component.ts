import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { FormMentalHealthConditionsComponent } from '@app/shared/components/form-mental-health-conditions.component';

@Component({
	selector: 'app-step-worker-licence-mental-health-conditions',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<app-form-mental-health-conditions
				[applicationTypeCode]="applicationTypeCode"
				[form]="form"
				[isWizardStep]="true"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
			></app-form-mental-health-conditions>
		</app-step-section>
	`,
	styles: [],
})
export class StepWorkerLicenceMentalHealthConditionsComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	form: FormGroup = this.workerApplicationService.mentalHealthConditionsFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(FormMentalHealthConditionsComponent)
	formMentalHealthConditionsComponent!: FormMentalHealthConditionsComponent;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	ngOnInit(): void {
		[this.title, this.subtitle] = this.workerApplicationService.getMentalHealthConditionsTitle(
			this.applicationTypeCode,
			this.hasPreviousMhcFormUpload.value
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

	get hasPreviousMhcFormUpload(): FormControl {
		return this.form.get('hasPreviousMhcFormUpload') as FormControl;
	}
}
