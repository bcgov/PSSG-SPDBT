import { Component, Input, ViewChild } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { CommonSwlPermitTermsComponent } from '@app/modules/personal-licence-application/components/shared/common-step-components/common-swl-permit-terms.component';
import { CommonSwlPermitTermsUpdateReplaceComponent } from '../common-step-components/common-swl-permit-terms-update-replace.component';

@Component({
	selector: 'app-step-worker-licence-terms-of-use',
	template: `
		<app-step-section
			heading="Terms and Conditions"
			subheading="Read, download, and accept the Terms of Use to continue"
		>
			<ng-container *ngIf="isNewOrRenewal; else isUpdate">
				<app-common-swl-permit-terms [form]="form"></app-common-swl-permit-terms>
			</ng-container>
			<ng-template #isUpdate>
				<app-common-swl-permit-terms-update-replace [form]="form"></app-common-swl-permit-terms-update-replace>
			</ng-template>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepWorkerLicenceTermsOfUseComponent implements LicenceChildStepperStepComponent {
	form = this.workerApplicationService.termsAndConditionsFormGroup;

	@ViewChild(CommonSwlPermitTermsComponent) commonTermsComponent!: CommonSwlPermitTermsComponent;
	@ViewChild(CommonSwlPermitTermsUpdateReplaceComponent)
	commonTermsUpdateReplaceComponent!: CommonSwlPermitTermsUpdateReplaceComponent;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	isFormValid(): boolean {
		if (this.isNewOrRenewal) {
			return this.commonTermsComponent.isFormValid();
		}

		return this.commonTermsUpdateReplaceComponent.isFormValid();
	}

	get isNewOrRenewal(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal || this.applicationTypeCode === ApplicationTypeCode.New
		);
	}
}
