import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/modules/personal-licence-application/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-permit-physical-characteristics',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<app-common-physical-characteristics [form]="form"></app-common-physical-characteristics>
		</app-step-section>
	`,
	styles: [],
})
export class StepPermitPhysicalCharacteristicsComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';
	form: FormGroup = this.permitApplicationService.characteristicsFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		if (this.isRenewalOrUpdate) {
			this.title = 'Confirm identifying information';
			this.subtitle = 'Update any information that has changed since your last application';
		} else {
			this.title = 'Provide identifying information';
			this.subtitle = '';
		}
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
