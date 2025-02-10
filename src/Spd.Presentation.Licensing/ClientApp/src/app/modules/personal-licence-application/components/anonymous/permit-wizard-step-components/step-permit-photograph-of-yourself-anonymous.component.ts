import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-permit-photograph-of-yourself-anonymous',
	template: `
		<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.New; else isRenewOrUpdate">
			<app-step-permit-photograph-of-yourself-new
				[form]="form"
				[serviceTypeCode]="serviceTypeCode"
			></app-step-permit-photograph-of-yourself-new>
		</ng-container>

		<ng-template #isRenewOrUpdate>
			<app-step-permit-photograph-of-yourself-renew-and-update
				[serviceTypeCode]="serviceTypeCode"
				[form]="form"
			></app-step-permit-photograph-of-yourself-renew-and-update>
		</ng-template>
	`,
	styles: [],
	standalone: false,
})
export class StepPermitPhotographOfYourselfAnonymousComponent implements LicenceChildStepperStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.permitApplicationService.photographOfYourselfFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() serviceTypeCode!: ServiceTypeCode;

	constructor(private permitApplicationService: PermitApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
