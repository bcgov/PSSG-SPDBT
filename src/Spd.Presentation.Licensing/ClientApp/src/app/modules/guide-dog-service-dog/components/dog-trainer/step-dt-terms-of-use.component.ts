import { Component, ViewChild } from '@angular/core';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { StepGdsdTermsOfUseComponent } from '../shared/step-gdsd-terms-of-use.component';

@Component({
	selector: 'app-step-dt-terms-of-use',
	template: `<app-step-gdsd-terms-of-use [form]="form"></app-step-gdsd-terms-of-use> `,
	styles: [],
	standalone: false,
})
export class StepDtTermsOfUseComponent implements LicenceChildStepperStepComponent {
	form = this.dogTrainerApplicationService.termsAndConditionsFormGroup;

	@ViewChild(StepGdsdTermsOfUseComponent) termsOfUseComponent!: StepGdsdTermsOfUseComponent;

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	isFormValid(): boolean {
		return this.termsOfUseComponent.isFormValid();
	}
}
