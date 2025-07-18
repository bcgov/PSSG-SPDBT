import { Component, Input, OnInit } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-mdra-branches',
	template: `
		<app-step-section heading="Branch offices" [subheading]="subtitle">
			<app-form-mdra-branches [form]="form" [isReadonly]="false"></app-form-mdra-branches>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepMdraBranchesComponent implements OnInit, LicenceChildStepperStepComponent {
	form = this.metalDealersApplicationService.branchesFormGroup;

	subtitle = '';

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	ngOnInit(): void {
		const isRenewalOrUpdate = this.metalDealersApplicationService.isRenewalOrUpdate();
		this.subtitle = isRenewalOrUpdate ? 'Confirm your branch information' : 'Provide the branch information';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
