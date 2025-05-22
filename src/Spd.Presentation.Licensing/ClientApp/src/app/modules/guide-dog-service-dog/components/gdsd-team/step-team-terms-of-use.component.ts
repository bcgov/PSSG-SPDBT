import { Component, ViewChild } from '@angular/core';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormGdsdTermsOfUseComponent } from '@app/modules/guide-dog-service-dog/components/shared/form-gdsd-terms-of-use.component';

@Component({
	selector: 'app-step-team-terms-of-use',
	template: ` <app-form-gdsd-terms-of-use [form]="form"></app-form-gdsd-terms-of-use> `,
	styles: [],
	standalone: false,
})
export class StepTeamTermsOfUseComponent implements LicenceChildStepperStepComponent {
	form = this.gdsdTeamApplicationService.termsAndConditionsFormGroup;

	@ViewChild(FormGdsdTermsOfUseComponent) termsOfUseComponent!: FormGdsdTermsOfUseComponent;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	isFormValid(): boolean {
		return this.termsOfUseComponent.isFormValid();
	}
}
