import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-step-worker-licence-aliases',
	template: `
		<section class="step-section">
			<div class="step">
				<!-- <ng-container
					*ngIf="
						applicationTypeCode === applicationTypeCodes.Renewal || applicationTypeCode === applicationTypeCodes.Update
					"
				>
					<app-common-update-renewal-alert [applicationTypeCode]="applicationTypeCode"></app-common-update-renewal-alert>
				</ng-container> -->

				<app-step-title title="Do you have any previous names or aliases?"></app-step-title>

				<app-common-aliases [form]="form"></app-common-aliases>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceAliasesComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.aliasesFormGroup;

	applicationTypeCodes = ApplicationTypeCode;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
