import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

@Component({
	selector: 'app-step-permit-criminal-history',
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
export class StepPermitCriminalHistoryComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';

	form: FormGroup = this.permitApplicationService.criminalHistoryFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(
		private permitApplicationService: PermitApplicationService,
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
