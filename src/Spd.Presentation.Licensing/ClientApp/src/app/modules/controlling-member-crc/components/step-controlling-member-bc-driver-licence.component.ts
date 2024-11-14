import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-controlling-member-bc-driver-licence',
	template: `
		<app-step-section title="Do you have a BC Driver's Licence?">
			<div class="row">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<app-alert type="info" icon="info">
						Providing your driver's licence number will speed up processing times
					</app-alert>
				</div>
			</div>

			<app-form-bc-driver-licence [form]="form"></app-form-bc-driver-licence>
		</app-step-section>
	`,
	styles: [],
})
export class StepControllingMemberBcDriverLicenceComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.controllingMembersService.bcDriversLicenceFormGroup;

	constructor(private controllingMembersService: ControllingMemberCrcService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
