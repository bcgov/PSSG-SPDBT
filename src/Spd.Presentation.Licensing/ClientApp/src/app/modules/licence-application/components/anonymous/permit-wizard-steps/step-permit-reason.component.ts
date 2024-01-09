import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

@Component({
	selector: 'app-step-permit-reason',
	template: ` <p>step-permit-reason works!</p> `,
	styles: ``,
})
export class StepPermitReasonComponent implements LicenceChildStepperStepComponent {
	// booleanTypeCodes = BooleanTypeCode;
	// matcher = new FormErrorStateMatcher();

	form: FormGroup = this.permitApplicationService.applicationTypeFormGroup;

	constructor(private permitApplicationService: PermitApplicationService) {}

	isFormValid(): boolean {
		return true;
		// this.form.markAllAsTouched();
		// return this.form.valid;
	}

	// get hasBcDriversLicence(): FormControl {
	// 	return this.form.get('hasBcDriversLicence') as FormControl;
	// }
}
