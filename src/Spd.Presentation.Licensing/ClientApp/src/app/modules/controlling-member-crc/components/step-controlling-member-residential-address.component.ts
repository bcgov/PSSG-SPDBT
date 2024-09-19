import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-controlling-member-residential-address',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<div class="row" *ngIf="isLoggedIn">
				<div class="col-md-8 col-sm-12 mx-auto">
					<app-alert type="info" icon="" [showBorder]="false">
						Has your residential address changed?
						<a [href]="addressChangeUrl" target="_blank">Change your address online</a> to update this information on
						your BC Services Card. Any changes you make will then be updated here.
					</app-alert>
				</div>
			</div>

			<app-address [form]="form" [isReadonly]="isLoggedIn"></app-address>
		</app-step-section>
	`,
	styles: [],
})
export class StepControllingMemberResidentialAddressComponent implements OnInit, LicenceChildStepperStepComponent {
	addressChangeUrl = SPD_CONSTANTS.urls.addressChangeUrl;
	title = '';
	subtitle = '';

	form: FormGroup = this.controllingMembersService.residentialAddressFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() isLoggedIn!: boolean;

	constructor(private controllingMembersService: ControllingMemberCrcService) {}

	ngOnInit(): void {
		[this.title, this.subtitle] = this.controllingMembersService.getResidentialAddressTitle(this.applicationTypeCode);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
