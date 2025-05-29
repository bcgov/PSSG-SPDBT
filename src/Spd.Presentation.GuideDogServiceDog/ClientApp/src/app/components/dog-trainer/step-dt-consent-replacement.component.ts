import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-dt-consent-replacement',
	template: `
		<app-step-section title="Acknowledgement">
			<app-form-gdsd-consent-replacement
				[form]="form"
				[showApplicantOrLegalGuardianName]="false"
			></app-form-gdsd-consent-replacement>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepDtConsentReplacementComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.dogTrainerApplicationService.consentAndDeclarationDtFormGroup;

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
