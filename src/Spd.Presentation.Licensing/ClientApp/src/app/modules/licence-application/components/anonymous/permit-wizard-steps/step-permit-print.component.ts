import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

@Component({
	selector: 'app-step-permit-print',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Do you need a new permit printed?"
					subtitle="If your permit was lost or stolen, we can mail you a replacement"
				></app-step-title>

				<div class="row">
					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<mat-radio-group aria-label="Select an option" formControlName="reprintLicence">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('reprintLicence')?.dirty || form.get('reprintLicence')?.touched) &&
									form.get('reprintLicence')?.invalid &&
									form.get('reprintLicence')?.hasError('required')
								"
								>This is required</mat-error
							>
						</form>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitPrintComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.permitApplicationService.reprintLicenceFormGroup;

	constructor(private permitApplicationService: PermitApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
