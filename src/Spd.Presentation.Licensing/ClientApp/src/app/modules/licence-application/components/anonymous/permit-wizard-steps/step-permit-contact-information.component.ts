import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { CommonContactInformationComponent } from '@app/modules/licence-application/components/shared/step-components/common-contact-information.component';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

@Component({
	selector: 'app-step-permit-contact-information',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container *ngIf="isRenewalOrUpdate">
					<app-common-update-renewal-alert
						[applicationTypeCode]="applicationTypeCode"
					></app-common-update-renewal-alert>
				</ng-container>

				<app-step-title title="Provide your contact information"></app-step-title>
				<div class="row">
					<div class="col-12 mx-auto">
						<app-common-contact-information [form]="form"></app-common-contact-information>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitContactInformationComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.permitApplicationService.contactInformationFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(CommonContactInformationComponent) contactInformationComponent!: CommonContactInformationComponent;

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
