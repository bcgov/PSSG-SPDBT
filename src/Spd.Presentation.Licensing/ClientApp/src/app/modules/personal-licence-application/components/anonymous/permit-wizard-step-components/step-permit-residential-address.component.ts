import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { PermitApplicationService } from '@core/services/permit-application.service';

@Component({
	selector: 'app-step-permit-residential-address',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<div class="row">
				<div class="col-md-8 col-sm-12 mx-auto">
					<app-address [form]="form" [isWideView]="true"></app-address>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepPermitResidentialAddressComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	form: FormGroup = this.permitApplicationService.residentialAddressFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		[this.title, this.subtitle] = this.permitApplicationService.getResidentialAddressTitle(this.applicationTypeCode);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
