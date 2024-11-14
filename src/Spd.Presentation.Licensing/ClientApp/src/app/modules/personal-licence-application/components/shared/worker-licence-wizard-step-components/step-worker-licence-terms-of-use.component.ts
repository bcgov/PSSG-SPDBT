import { Component, Input, ViewChild } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { CommonSwlPermitTermsComponent } from '@app/modules/personal-licence-application/components/shared/common-step-components/common-swl-permit-terms.component';

@Component({
	selector: 'app-step-worker-licence-terms-of-use',
	template: `
		<app-step-section title="Terms and Conditions" subtitle="Read, download, and accept the Terms of Use to continue">
			<app-common-swl-permit-terms
				[form]="form"
				[applicationTypeCode]="applicationTypeCode"
			></app-common-swl-permit-terms>
		</app-step-section>
	`,
	styles: [],
})
export class StepWorkerLicenceTermsOfUseComponent implements LicenceChildStepperStepComponent {
	form = this.workerApplicationService.termsAndConditionsFormGroup;

	@ViewChild(CommonSwlPermitTermsComponent) commonTermsComponent!: CommonSwlPermitTermsComponent;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	isFormValid(): boolean {
		return this.commonTermsComponent.isFormValid();
	}
}
