import { Component, ViewChild } from '@angular/core';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormGdsdTermsOfUseComponent } from '@app/modules/guide-dog-service-dog/components/shared/form-gdsd-terms-of-use.component';

@Component({
	selector: 'app-step-dt-terms-of-use',
	template: `<app-form-gdsd-terms-of-use [form]="form"></app-form-gdsd-terms-of-use> `,
	styles: [],
	standalone: false,
})
export class StepDtTermsOfUseComponent implements LicenceChildStepperStepComponent {
	form = this.dogTrainerApplicationService.termsAndConditionsFormGroup;

	@ViewChild(FormGdsdTermsOfUseComponent) termsOfUseComponent!: FormGdsdTermsOfUseComponent;

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	isFormValid(): boolean {
		return this.termsOfUseComponent.isFormValid();
	}
}
