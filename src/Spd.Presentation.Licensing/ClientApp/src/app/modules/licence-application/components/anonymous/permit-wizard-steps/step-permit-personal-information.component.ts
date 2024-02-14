import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

@Component({
	selector: 'app-step-permit-personal-information',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container *ngIf="isRenewalOrUpdate">
					<app-common-update-renewal-alert
						[applicationTypeCode]="applicationTypeCode"
					></app-common-update-renewal-alert>
				</ng-container>

				<app-step-title title="Your personal information"></app-step-title>

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
export class StepPermitPersonalInformationComponent implements LicenceChildStepperStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.permitApplicationService.personalInformationFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

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
