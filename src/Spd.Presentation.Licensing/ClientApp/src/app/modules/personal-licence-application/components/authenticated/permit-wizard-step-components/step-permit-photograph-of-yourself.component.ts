import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-permit-photograph-of-yourself',
	template: `
		<ng-container *ngIf="applicationTypeCode === applicationTypeCodeNew; else isRenewOrUpdate">
			<app-step-permit-photograph-of-yourself-new
				[form]="form"
				[serviceTypeCode]="serviceTypeCode"
			></app-step-permit-photograph-of-yourself-new>
		</ng-container>

		<ng-template #isRenewOrUpdate>
			<app-step-permit-photograph-of-yourself-renew-and-update
				[form]="form"
				[serviceTypeCode]="serviceTypeCode"
			></app-step-permit-photograph-of-yourself-renew-and-update>
		</ng-template>
	`,
	styles: [],
	standalone: false,
})
export class StepPermitPhotographOfYourselfComponent implements LicenceChildStepperStepComponent {
	applicationTypeCodeNew = ApplicationTypeCode.New;

	form: FormGroup = this.permitApplicationService.photographOfYourselfFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() serviceTypeCode!: ServiceTypeCode;

	constructor(private permitApplicationService: PermitApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
