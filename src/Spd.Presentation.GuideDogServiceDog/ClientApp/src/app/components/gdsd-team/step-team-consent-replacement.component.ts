import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-team-consent-replacement',
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
export class StepTeamConsentReplacementComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.gdsdTeamApplicationService.consentAndDeclarationFormGroup;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
