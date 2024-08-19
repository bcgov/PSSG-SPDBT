import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { ControllingMembersService } from '@app/core/services/controlling-members.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-controlling-member-aliases',
	template: `
		<app-step-section title="Do you have any previous names or aliases?" [subtitle]="subtitle">
			<app-form-aliases [form]="form"></app-form-aliases>
		</app-step-section>
	`,
	styles: [],
})
export class StepControllingMemberAliasesComponent implements OnInit, LicenceChildStepperStepComponent {
	subtitle = '';

	form: FormGroup = this.controllingMembersService.aliasesFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private controllingMembersService: ControllingMembersService) {}

	ngOnInit(): void {
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
