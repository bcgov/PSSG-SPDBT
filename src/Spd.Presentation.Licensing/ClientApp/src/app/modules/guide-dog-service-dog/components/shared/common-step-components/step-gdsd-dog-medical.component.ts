import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-gdsd-dog-medical',
	template: `
		<app-step-section title="Medical information">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="fs-5 lh-base mt-3 mb-2">
								Are your dog's inoculations (rabies, distemper, parvovirus) up-to-date?
							</div>

							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="areInoculationsUpToDate">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('areInoculationsUpToDate')?.dirty || form.get('areInoculationsUpToDate')?.touched) &&
										form.get('areInoculationsUpToDate')?.invalid &&
										form.get('areInoculationsUpToDate')?.hasError('required')
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
export class StepGdsdDogMedicalComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.gdsdApplicationService.dogInformationFormGroup;

	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
