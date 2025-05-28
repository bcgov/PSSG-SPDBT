import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-rd-consent-replacement',
	template: `
		<app-step-section title="Acknowledgement">
			<app-form-gdsd-consent-replacement
				[form]="form"
				[showApplicantOrLegalGuardianName]="true"
			></app-form-gdsd-consent-replacement>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepRdConsentReplacementComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.retiredDogApplicationService.consentAndDeclarationFormGroup;

	constructor(private retiredDogApplicationService: RetiredDogApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
