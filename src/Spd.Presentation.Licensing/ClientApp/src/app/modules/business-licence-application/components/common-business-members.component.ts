import { Component, Input } from '@angular/core';
import { ApplicationTypeCode, ContactRoleCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-common-business-members',
	template: `
		<app-common-controlling-or-business-members
			[form]="form"
			[memberTypeCode]="businessManagerTypeCode"
			memberLabel="Business Manager"
			[defaultExpanded]="true"
			[isWizard]="false"
			[isApplDraftOrWaitingForPayment]="isApplDraftOrWaitingForPayment"
			[isApplExists]="isApplExists"
			[isLicenceExists]="isLicenceExists"
			[isReadonly]="isReadonly"
		></app-common-controlling-or-business-members>
	`,
	styles: [],
	standalone: false,
})
export class CommonBusinessMembersComponent implements LicenceChildStepperStepComponent {
	businessManagerTypeCode = ContactRoleCode.BusinessManager;
	form = this.businessApplicationService.businessMembersFormGroup;

	@Input() defaultExpanded = false;
	@Input() isWizard = false;
	@Input() isApplDraftOrWaitingForPayment = false;
	@Input() isApplExists = false;
	@Input() isLicenceExists = false;
	@Input() isReadonly = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
