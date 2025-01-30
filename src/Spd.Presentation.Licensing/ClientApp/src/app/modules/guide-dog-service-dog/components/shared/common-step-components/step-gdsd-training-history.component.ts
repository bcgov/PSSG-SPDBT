import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-gdsd-training-history',
	template: `
		<app-step-section
			title="Training History Information"
			subtitle="Provide as much information as you can with regard to your dog's training history as well as you & your dog's combined 
training history."
		>
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="fs-5 lh-base mt-3 mb-2">Have you attended a training school(s) and/or program(s)?</div>

							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="hasAttendedTrainingSchool">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('hasAttendedTrainingSchool')?.dirty || form.get('hasAttendedTrainingSchool')?.touched) &&
										form.get('hasAttendedTrainingSchool')?.invalid &&
										form.get('hasAttendedTrainingSchool')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepGdsdTrainingHistoryComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.gdsdApplicationService.trainingHistoryFormGroup;

	booleanTypeCodes = BooleanTypeCode;

	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
