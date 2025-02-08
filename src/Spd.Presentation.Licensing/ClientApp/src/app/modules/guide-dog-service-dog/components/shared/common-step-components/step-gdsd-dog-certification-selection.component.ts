import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-gdsd-dog-certification-selection',
	template: `
		<app-step-section title="Dog Certification Selection">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="fs-5 lh-base mt-3 mb-2">
								Is your dog trained by Assistance Dogs International or International Guide Dog Federation accredited
								schools?
							</div>

							<div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="isDogTrainedByAccreditedSchool">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('isDogTrainedByAccreditedSchool')?.dirty ||
											form.get('isDogTrainedByAccreditedSchool')?.touched) &&
										form.get('isDogTrainedByAccreditedSchool')?.invalid &&
										form.get('isDogTrainedByAccreditedSchool')?.hasError('required')
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
export class StepGdsdDogCertificationSelectionComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.gdsdApplicationService.dogCertificationSelectionFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
