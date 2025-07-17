import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-permit-photograph-of-yourself-anonymous',
	template: `
		@if (applicationTypeCode === applicationTypeCodes.New) {
			<app-step-permit-photograph-of-yourself-new
				[form]="form"
				[serviceTypeCode]="serviceTypeCode"
			></app-step-permit-photograph-of-yourself-new>
		} @else {
			<app-step-permit-photograph-of-yourself-renew-and-update
				[form]="form"
				[serviceTypeCode]="serviceTypeCode"
			></app-step-permit-photograph-of-yourself-renew-and-update>
		}
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
