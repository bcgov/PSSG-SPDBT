import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { PermitApplicationService } from '@core/services/permit-application.service';

@Component({
	selector: 'app-step-permit-reprint',
	template: `
		<app-step-section title="Do you need a new permit printed?" [subtitle]="subtitle">
			<app-licence-reprint [form]="form"></app-licence-reprint>
		</app-step-section>
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
