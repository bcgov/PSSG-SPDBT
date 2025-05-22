import { Component, ViewChild } from '@angular/core';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormGdsdTermsOfUseComponent } from '@app/modules/guide-dog-service-dog/components/shared/form-gdsd-terms-of-use.component';

@Component({
	selector: 'app-step-rd-terms-of-use',
	template: ` <app-form-gdsd-terms-of-use [form]="form"></app-form-gdsd-terms-of-use> `,
	styles: [],
	standalone: false,
})
export class StepRdTermsOfUseComponent implements LicenceChildStepperStepComponent {
	form = this.retiredDogApplicationService.termsAndConditionsFormGroup;

	@ViewChild(FormGdsdTermsOfUseComponent) termsOfUseComponent!: FormGdsdTermsOfUseComponent;

	constructor(private retiredDogApplicationService: RetiredDogApplicationService) {}

	isFormValid(): boolean {
		return this.termsOfUseComponent.isFormValid();
	}
}
