import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-step-worker-licence-personal-information-anonymous',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title [title]="title" [subtitle]="subtitle"></app-step-title>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.New">
					<app-common-personal-information-new-anonymous [form]="form"></app-common-personal-information-new-anonymous>
				</ng-container>

				<ng-container *ngIf="isRenewalOrUpdate">
					<app-common-personal-information-renew-anonymous
						[applicationTypeCode]="applicationTypeCode"
						[form]="form"
					></app-common-personal-information-renew-anonymous>
				</ng-container>
			</div>
		</section>
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

	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}
}
