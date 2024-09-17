import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceApplicationService } from '@app/core/services/licence-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-worker-licence-personal-information-anonymous',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.New">
				<app-form-personal-information-new-anonymous [form]="form"></app-form-personal-information-new-anonymous>
			</ng-container>

			<ng-container *ngIf="isRenewalOrUpdate">
				<app-form-personal-information-renew-update-anonymous
					[form]="form"
					[applicationTypeCode]="applicationTypeCode"
					(fileUploaded)="onFileUploaded()"
					(fileRemoved)="onFileRemoved()"
				></app-form-personal-information-renew-update-anonymous>
			</ng-container>
		</app-step-section>
	`,
	styles: [],
})
export class StepWorkerLicencePersonalInformationAnonymousComponent
	implements OnInit, LicenceChildStepperStepComponent
{
	title = '';
	subtitle = '';

	applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.licenceApplicationService.personalInformationFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.isRenewalOrUpdate ? 'Confirm your personal information' : 'Your personal information';

		this.subtitle = this.isRenewalOrUpdate ? 'Update any information that has changed since your last application' : '';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileUploaded(): void {
		this.licenceApplicationService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		this.licenceApplicationService.hasValueChanged = true;
	}

	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}
}
