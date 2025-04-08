import { Component } from '@angular/core';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-metal-dealers-branches',
	template: `
		<app-step-section title="Branch offices" subtitle="Click on the 'Add Branch' button to add your branch offices.">
			<app-form-metal-dealers-branches [form]="form" [isReadonly]="false"></app-form-metal-dealers-branches>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepMetalDealersBranchesComponent implements LicenceChildStepperStepComponent {
	form = this.metalDealersApplicationService.branchesFormGroup;

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
