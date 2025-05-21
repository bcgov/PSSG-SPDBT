import { Component, ViewChild } from '@angular/core';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { StepGdsdTermsOfUseComponent } from '../shared/step-gdsd-terms-of-use.component';

@Component({
	selector: 'app-step-rd-terms-of-use',
	template: ` <app-step-gdsd-terms-of-use [form]="form"></app-step-gdsd-terms-of-use> `,
	styles: [],
	standalone: false,
})
export class StepRdTermsOfUseComponent implements LicenceChildStepperStepComponent {
	form = this.retiredDogApplicationService.termsAndConditionsFormGroup;

	@ViewChild(StepGdsdTermsOfUseComponent) termsOfUseComponent!: StepGdsdTermsOfUseComponent;

	constructor(private retiredDogApplicationService: RetiredDogApplicationService) {}

	isFormValid(): boolean {
		return this.termsOfUseComponent.isFormValid();
	}
}
