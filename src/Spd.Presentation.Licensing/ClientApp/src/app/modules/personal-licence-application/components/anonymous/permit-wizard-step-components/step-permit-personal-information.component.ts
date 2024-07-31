import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { PermitApplicationService } from '@core/services/permit-application.service';

@Component({
	selector: 'app-step-permit-personal-information',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.New">
				<app-common-personal-information-new-anonymous [form]="form"></app-common-personal-information-new-anonymous>
			</ng-container>

			<ng-container *ngIf="isRenewalOrUpdate">
				<app-common-personal-information-renew-anonymous
					[applicationTypeCode]="applicationTypeCode"
					[form]="form"
				></app-common-personal-information-renew-anonymous>
			</ng-container>
		</app-step-section>
	`,
	styles: [],
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

	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}
}
