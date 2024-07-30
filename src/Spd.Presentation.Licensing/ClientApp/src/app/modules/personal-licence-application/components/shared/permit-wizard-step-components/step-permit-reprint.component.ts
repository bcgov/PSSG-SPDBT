import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/modules/personal-licence-application/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-permit-reprint',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Do you need a new permit printed?" [subtitle]="subtitle"></app-step-title>

				<app-licence-reprint [form]="form"></app-licence-reprint>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitReprintComponent implements OnInit, LicenceChildStepperStepComponent {
	subtitle = '';
	form: FormGroup = this.permitApplicationService.reprintLicenceFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		this.subtitle =
			this.applicationTypeCode === ApplicationTypeCode.Update
				? 'If your permit was lost or stolen, we can mail you a replacement'
				: '';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
