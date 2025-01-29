import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-gdsd-school-trainings',
	template: `
		<app-step-section title="Training schools">
			<form [formGroup]="form" novalidate>
				<div class="row my-2">
					<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto"></div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepGdsdSchoolTrainingsComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.gdsdApplicationService.governmentPhotoIdFormGroup;

	matcher = new FormErrorStateMatcher();

	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
