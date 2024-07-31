import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/modules/personal-licence-application/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-permit-aliases',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<app-common-aliases [form]="form"></app-common-aliases>
		</app-step-section>
	`,
	styles: [],
})
export class StepPermitAliasesComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	form: FormGroup = this.permitApplicationService.aliasesFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		this.title = 'Do you have any previous names or aliases?';
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
