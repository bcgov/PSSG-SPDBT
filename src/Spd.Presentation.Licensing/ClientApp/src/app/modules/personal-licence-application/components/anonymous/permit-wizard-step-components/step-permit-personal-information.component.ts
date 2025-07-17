import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-permit-personal-information',
	template: `
		<app-step-section [heading]="title" [subheading]="subtitle">
			@if (applicationTypeCode === applicationTypeCodes.New) {
				<app-form-personal-information-new-anonymous [form]="form"></app-form-personal-information-new-anonymous>
			}

			@if (isRenewalOrUpdate) {
				<app-form-personal-information-renew-update-anonymous
					[form]="form"
					[applicationTypeCode]="applicationTypeCode"
					(fileUploaded)="onFileUploaded()"
					(fileRemoved)="onFileRemoved()"
				></app-form-personal-information-renew-update-anonymous>
			}
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepPermitPersonalInformationComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.permitApplicationService.personalInformationFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		this.title = this.isRenewalOrUpdate ? 'Confirm your personal information' : 'Your personal information';

		this.subtitle = this.isRenewalOrUpdate ? 'Update any information that has changed since your last application' : '';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileUploaded(): void {
		this.permitApplicationService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		this.permitApplicationService.hasValueChanged = true;
	}

	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}
}
