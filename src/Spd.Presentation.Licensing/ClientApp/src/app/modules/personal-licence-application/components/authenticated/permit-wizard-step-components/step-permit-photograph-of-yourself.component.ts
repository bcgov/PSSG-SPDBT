import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { PermitApplicationService } from '@core/services/permit-application.service';

@Component({
	selector: 'app-step-permit-photograph-of-yourself',
	template: `
		<ng-container *ngIf="applicationTypeCode === applicationTypeCodeNew; else isRenewOrUpdate">
			<app-step-permit-photograph-of-yourself-new [form]="form"></app-step-permit-photograph-of-yourself-new>
		</ng-container>

		<ng-template #isRenewOrUpdate>
			<app-step-permit-photograph-of-yourself-renew-and-update
				[form]="form"
			></app-step-permit-photograph-of-yourself-renew-and-update>
		</ng-template>
	`,
	styles: [],
})
export class StepPermitPhotographOfYourselfComponent implements LicenceChildStepperStepComponent {
	applicationTypeCodeNew = ApplicationTypeCode.New;

	form: FormGroup = this.permitApplicationService.photographOfYourselfFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
