import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

@Component({
	selector: 'app-step-permit-criminal-history',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container
					*ngIf="
						applicationTypeCode === applicationTypeCodes.Renewal || applicationTypeCode === applicationTypeCodes.Update
					"
				>
					<app-renewal-alert [applicationTypeCode]="applicationTypeCode"></app-renewal-alert>
				</ng-container>

				<app-step-title title="Have you previously been charged or convicted of a crime?"></app-step-title>

				<app-common-criminal-history [form]="form"></app-common-criminal-history>

				<!-- <div class="row">
					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<mat-radio-group aria-label="Select an option" formControlName="hasCriminalHistory">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('hasCriminalHistory')?.dirty || form.get('hasCriminalHistory')?.touched) &&
									form.get('hasCriminalHistory')?.invalid &&
									form.get('hasCriminalHistory')?.hasError('required')
								"
								>This is required</mat-error
							>
						</form>
					</div>
				</div> -->
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitCriminalHistoryComponent implements LicenceChildStepperStepComponent {
	// booleanTypeCodes = BooleanTypeCode;
	applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.permitApplicationService.criminalHistoryFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
