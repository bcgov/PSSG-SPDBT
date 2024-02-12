import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { CommonTermsComponent } from '../step-components/common-terms.component';

@Component({
	selector: 'app-step-worker-licence-terms-of-use',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Terms and Conditions"
					subtitle="Read, download, and accept the Terms of Use to continue"
				></app-step-title>

				<app-common-terms [form]="form"></app-common-terms>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceTermsOfUseComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.formBuilder.group({
		agreeToTermsAndConditions: new FormControl('', [Validators.requiredTrue]),
		dateSigned: new FormControl({ value: null, disabled: true }, [Validators.requiredTrue]),
	});

	@ViewChild(CommonTermsComponent) commonTermsComponent!: CommonTermsComponent;
	// this.licenceApplicationService.reprintLicenceFormGroup;

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		return this.commonTermsComponent.isFormValid();
	}
}
