import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BooleanTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

@Component({
	selector: 'app-step-permit-reason',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Why do you require a permit for body armour?"></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="col-xxl-4 col-xl-5 col-lg-12 mx-auto">
							<mat-checkbox formControlName="isOutdoorRecreation"> Outdoor recreation </mat-checkbox>
							<mat-checkbox formControlName="isPersonalProtection"> Personal protection </mat-checkbox>
							<mat-checkbox formControlName="isMyEmployment">My employment</mat-checkbox>
							<mat-checkbox formControlName="isTravelForConflict"
								>Travel in response to international conflict</mat-checkbox
							>
							<mat-checkbox formControlName="isOther">Other</mat-checkbox>
							<!-- <mat-error
												class="mat-option-error"
												*ngIf="
													(form.get('dogsPurposeFormGroup')?.dirty || form.get('dogsPurposeFormGroup')?.touched) &&
													form.get('dogsPurposeFormGroup')?.invalid &&
													form.get('dogsPurposeFormGroup')?.hasError('atLeastOneCheckboxValidator')
												"
												>At least one option must be selected</mat-error
											> -->
						</div>
					</div>
				</form>
			</div>
		</section>
	`,
	styles: ``,
})
export class StepPermitReasonComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	// applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.permitApplicationService.bodyArmourRequirementFormGroup;

	// @Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
