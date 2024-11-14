import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-controlling-member-aliases',
	template: `
		<app-step-section title="Do you have any previous names or aliases?">
			<app-form-aliases [form]="form"></app-form-aliases>
		</app-step-section>
	`,
	styles: [],
})
export class StepControllingMemberAliasesComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.controllingMembersService.aliasesFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private controllingMembersService: ControllingMemberCrcService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
