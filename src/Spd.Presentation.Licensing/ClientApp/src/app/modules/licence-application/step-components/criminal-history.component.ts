import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-criminal-history',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Have you previously been charged or convicted of a crime?"></app-step-title>
				<div class="step-container">
					<div class="row">
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
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class CriminalHistoryComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.licenceApplicationService.criminalHistoryFormGroup;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
