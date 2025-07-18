import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ServiceTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-step-worker-licence-photograph-of-yourself-renew-and-update',
	template: `
		<app-step-section [heading]="title">
			<app-form-photograph-of-yourself-update
				[form]="form"
				[serviceTypeCode]="securityWorkerLicenceCode"
				[originalPhotoOfYourselfExpired]="originalPhotoOfYourselfExpired"
				[photographOfYourself]="photographOfYourself"
				(fileUploaded)="onFileUploaded()"
				(fileRemoved)="onFileRemoved()"
			></app-form-photograph-of-yourself-update>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepWorkerLicencePhotographOfYourselfRenewAndUpdateComponent
	implements OnInit, LicenceChildStepperStepComponent
{
	title = '';
	originalPhotoOfYourselfExpired = false;
	photographOfYourself = this.workerApplicationService.photographOfYourself;
	securityWorkerLicenceCode = ServiceTypeCode.SecurityWorkerLicence;

	@Input() form!: FormGroup;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	ngOnInit(): void {
		this.originalPhotoOfYourselfExpired = !!this.workerApplicationService.workerModelFormGroup.get(
			'originalLicenceData.originalPhotoOfYourselfExpired'
		)?.value;

		if (!this.originalPhotoOfYourselfExpired) {
			this.title = 'Do you want to update your photo?';
		} else {
			this.title = 'Upload a photo of yourself';
		}
	}

	onFileUploaded(): void {
		this.workerApplicationService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		this.workerApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
