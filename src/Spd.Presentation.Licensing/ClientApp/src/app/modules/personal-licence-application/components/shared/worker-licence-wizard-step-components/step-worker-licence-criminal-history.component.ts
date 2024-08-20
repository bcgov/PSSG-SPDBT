import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { ApplicationService } from '@app/core/services/application.service';
import { LicenceApplicationService } from '@app/core/services/licence-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-worker-licence-criminal-history',
	template: `
		<app-step-section [title]="title">
			<app-common-criminal-history
				[form]="form"
				[applicationTypeCode]="applicationTypeCode"
				[isWizardStep]="true"
			></app-common-criminal-history>
		</app-step-section>
	`,
	styles: [],
})
export class StepWorkerLicenceCriminalHistoryComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';

	form: FormGroup = this.licenceApplicationService.criminalHistoryFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(
		private licenceApplicationService: LicenceApplicationService,
		private commonApplicationService: ApplicationService
	) {}

	ngOnInit(): void {
		this.title = this.commonApplicationService.getCriminalHistoryTitle(this.applicationTypeCode);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
