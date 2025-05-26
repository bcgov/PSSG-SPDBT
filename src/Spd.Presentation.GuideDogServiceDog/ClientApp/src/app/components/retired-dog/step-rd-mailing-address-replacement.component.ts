import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-rd-mailing-address-replacement',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<app-form-gdsd-mailing-address-replacement [form]="form"></app-form-gdsd-mailing-address-replacement>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepRdMailingAddressReplacementComponent implements OnInit, LicenceChildStepperStepComponent {
	form: FormGroup = this.retiredDogApplicationService.mailingAddressFormGroup;

	title = 'Review your mailing address';
	subtitle = 'Ensure your mailing address is correct before submitting your application';

	constructor(
		private retiredDogApplicationService: RetiredDogApplicationService,
		private authProcessService: AuthProcessService
	) {}

	ngOnInit(): void {
		this.authProcessService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			this.captchaFormGroup.patchValue({ displayCaptcha: !isLoggedIn });
		});
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get captchaFormGroup(): FormGroup {
		return this.form.get('captchaFormGroup') as FormGroup;
	}
}
