import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BizTypeCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-business-licence-swl-sole-proprietor',
	template: `
		<app-step-section title="What is the type of business or company?">
			<form [formGroup]="form" novalidate>
				<div class="row my-4">
					<div class="col-xxl-4 col-xl-4 col-lg-6 col-md-12 mx-auto">
						<mat-radio-group aria-label="Select an option" formControlName="bizTypeCode">
							<mat-radio-button class="radio-label" [value]="bizTypeCodes.NonRegisteredPartnership"
								>Non-Registered Sole Proprietor</mat-radio-button
							>
							<mat-divider class="my-2"></mat-divider>
							<mat-radio-button class="radio-label" [value]="bizTypeCodes.RegisteredSoleProprietor"
								>Registered Sole Proprietor</mat-radio-button
							>
						</mat-radio-group>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('bizTypeCode')?.dirty || form.get('bizTypeCode')?.touched) &&
								form.get('bizTypeCode')?.invalid &&
								form.get('bizTypeCode')?.hasError('required')
							"
							>This is required</mat-error
						>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
})
export class StepBusinessLicenceSwlSoleProprietorComponent implements LicenceChildStepperStepComponent {
	bizTypeCodes = BizTypeCode;

	form: FormGroup = this.businessApplicationService.businessInformationFormGroup;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
