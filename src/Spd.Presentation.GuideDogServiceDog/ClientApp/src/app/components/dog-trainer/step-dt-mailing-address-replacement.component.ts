import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-dt-mailing-address-replacement',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<app-form-gdsd-mailing-address-replacement [form]="form"></app-form-gdsd-mailing-address-replacement>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepDtMailingAddressReplacementComponent implements OnInit, LicenceChildStepperStepComponent {
	form: FormGroup = this.dogTrainerApplicationService.mailingAddressFormGroup;

	title = 'Review your mailing address';
	subtitle = 'Ensure your mailing address is correct before submitting your application';

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	ngOnInit(): void {
		this.captchaFormGroup.patchValue({ displayCaptcha: true });
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get captchaFormGroup(): FormGroup {
		return this.form.get('captchaFormGroup') as FormGroup;
	}
}
