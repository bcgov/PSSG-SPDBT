import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-controlling-member-residential-address',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<app-address [form]="form"></app-address>
		</app-step-section>
	`,
	styles: [],
})
export class StepControllingMemberResidentialAddressComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	form: FormGroup = this.controllingMembersService.residentialAddressFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private controllingMembersService: ControllingMemberCrcService) {}

	ngOnInit(): void {
		[this.title, this.subtitle] = this.controllingMembersService.getResidentialAddressTitle(this.applicationTypeCode);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
