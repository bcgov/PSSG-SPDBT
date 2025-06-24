import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-permit-criminal-history',
	template: `
		<app-step-section [heading]="title">
			<app-common-criminal-history
				[form]="form"
				[applicationTypeCode]="applicationTypeCode"
				[isWizardStep]="true"
			></app-common-criminal-history>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
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
