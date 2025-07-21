import { Component, Input } from '@angular/core';
import { ApplicationTypeCode, ContactRoleCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-common-business-members',
	template: `
		<app-common-controlling-or-business-members
			[form]="form"
			[isControllingMember]="false"
			memberLabel="Business Manager"
			[defaultExpanded]="true"
			[isWizard]="false"
			[isApplDraftOrWaitingForPayment]="isApplDraftOrWaitingForPayment"
			[isApplExists]="isApplExists"
			[isLicenceExists]="isLicenceExists"
			[isReadonly]="isReadonly"
		></app-common-controlling-or-business-members>

		@if (!minCountValid) {
			<div class="mt-3">
				<mat-error class="mat-option-error">At least one Controlling Member or Business Manager is required</mat-error>
			</div>
		}
		@if (!maxCountValid) {
			<div class="mt-3">
				<mat-error class="mat-option-error"
					>At most {{ maxCount }} Controlling Members and Business Managers can be entered</mat-error
				>
			</div>
		}
	`,
	styles: [],
	standalone: false,
})
export class CommonBusinessMembersComponent implements LicenceChildStepperStepComponent {
	businessManagerTypeCode = ContactRoleCode.BusinessManager;
	form = this.businessApplicationService.businessMembersFormGroup;

	maxCount = SPD_CONSTANTS.maxCount.controllingMembersAndBusinessManagers;
	minCountValid = true;
	maxCountValid = true;

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

		const isValid = this.form.valid;
		if (!isValid) return false;

		const { minCountValid, maxCountValid } = this.businessApplicationService.isBusinessStakeholdersCountValid();
		this.minCountValid = minCountValid;
		this.maxCountValid = maxCountValid;

		return this.minCountValid && this.maxCountValid;
	}
}
