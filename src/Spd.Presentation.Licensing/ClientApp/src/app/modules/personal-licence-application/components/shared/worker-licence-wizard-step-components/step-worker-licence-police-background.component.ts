import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceApplicationService } from '@app/modules/personal-licence-application/licence-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-worker-licence-police-background',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					[title]="title"
					subtitle="A member of a police force as defined in the <i>British Columbia Police Act</i> may not hold a security worker licence."
				></app-step-title>

				<app-common-police-background [form]="form" [isCalledFromStep]="true"></app-common-police-background>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicencePoliceBackgroundComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	form: FormGroup = this.licenceApplicationService.policeBackgroundFormGroup;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.licenceApplicationService.getPoliceBackgroundTitle(this.applicationTypeCode);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
