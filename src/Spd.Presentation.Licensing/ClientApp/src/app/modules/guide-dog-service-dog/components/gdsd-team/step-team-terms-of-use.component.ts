import { Component, ViewChild } from '@angular/core';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { StepGdsdTermsOfUseComponent } from '../shared/step-gdsd-terms-of-use.component';

@Component({
	selector: 'app-step-team-terms-of-use',
	template: ` <app-step-gdsd-terms-of-use [form]="form"></app-step-gdsd-terms-of-use> `,
	styles: [],
	standalone: false,
})
export class StepTeamTermsOfUseComponent implements LicenceChildStepperStepComponent {
	form = this.gdsdTeamApplicationService.termsAndConditionsFormGroup;

	@ViewChild(StepGdsdTermsOfUseComponent) termsOfUseComponent!: StepGdsdTermsOfUseComponent;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	isFormValid(): boolean {
		return this.termsOfUseComponent.isFormValid();
	}
}
