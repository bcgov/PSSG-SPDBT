import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-team-dog-inoculations',
	template: `
		<app-step-section heading="Dog inoculations information">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-7 col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="text-minor-heading lh-base mt-3 mb-2">
								Are your dog’s vaccinations up to date (rabies, distemper, parvovirus)?
							</div>

							<div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
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
export class StepTeamDogInoculationsComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.gdsdTeamApplicationService.dogInoculationsFormGroup;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
