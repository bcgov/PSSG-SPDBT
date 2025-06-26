import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-permit-reprint',
	template: `
		<app-step-section heading="Do you need a new permit printed?" [subheading]="subtitle">
			<app-form-licence-reprint [form]="form"></app-form-licence-reprint>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
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
