import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ServiceTypeCode } from '@app/api/models';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-gdsd-photograph-of-yourself-renew',
	template: `
		<app-step-section [title]="title">
			<app-form-photograph-of-yourself-update
				[form]="form"
				label="licence"
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
export class StepGdsdPhotographOfYourselfRenewComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	originalPhotoOfYourselfExpired = false;
	photographOfYourself = this.gdsdApplicationService.photographOfYourself;

	form: FormGroup = this.gdsdApplicationService.photographOfYourselfFormGroup;

	@Input() serviceTypeCode!: ServiceTypeCode;

	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	ngOnInit(): void {
		this.originalPhotoOfYourselfExpired = this.gdsdApplicationService.gdsdModelFormGroup.get(
			'originalLicenceData.originalPhotoOfYourselfExpired'
		)?.value;

		if (!this.originalPhotoOfYourselfExpired) {
			this.title = 'Do you want to update your photo?';
		} else {
			this.title = 'Upload a photo of yourself';
		}
	}

	onFileUploaded(): void {
		this.gdsdApplicationService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		this.gdsdApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
