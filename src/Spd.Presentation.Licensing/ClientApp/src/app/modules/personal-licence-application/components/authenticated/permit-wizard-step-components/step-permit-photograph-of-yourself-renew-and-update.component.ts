import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ServiceTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-permit-photograph-of-yourself-renew-and-update',
	template: `
		<app-step-section [title]="title">
			<app-form-photograph-of-yourself-update
				[form]="form"
				serviceTypeLabel="permit"
				[serviceTypeCode]="serviceTypeCode"
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
export class StepPermitPhotographOfYourselfRenewAndUpdateComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	originalPhotoOfYourselfExpired = false;
	photographOfYourself = this.permitApplicationService.photographOfYourself;

	@Input() form!: FormGroup;
	@Input() serviceTypeCode!: ServiceTypeCode;

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		this.originalPhotoOfYourselfExpired = !!this.permitApplicationService.permitModelFormGroup.get(
			'originalLicenceData.originalPhotoOfYourselfExpired'
		)?.value;

		if (!this.originalPhotoOfYourselfExpired) {
			this.title = 'Do you want to update your photo?';
		} else {
			this.title = 'Upload a photo of yourself';
		}
	}

	onFileUploaded(): void {
		this.permitApplicationService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		this.permitApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
