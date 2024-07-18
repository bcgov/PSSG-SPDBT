import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-step-worker-licence-criminal-history',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title [title]="title"></app-step-title>

				<app-common-criminal-history
					[form]="form"
					[applicationTypeCode]="applicationTypeCode"
					[isCalledFromStep]="true"
				></app-common-criminal-history>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceCriminalHistoryComponent implements LicenceChildStepperStepComponent {
	title = '';

	form: FormGroup = this.licenceApplicationService.criminalHistoryFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(
		private licenceApplicationService: LicenceApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.title = this.commonApplicationService.getCriminalHistoryTitle(this.applicationTypeCode);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
