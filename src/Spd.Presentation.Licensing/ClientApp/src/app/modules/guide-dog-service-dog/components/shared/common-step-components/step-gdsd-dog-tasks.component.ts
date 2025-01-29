import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-gdsd-dog-tasks',
	template: `
		<app-step-section title="Specialized tasks" subtitle="todo">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="text-minor-heading mt-3 mb-2">Tasks the dog does to assist you with daily living</div>
						<mat-form-field>
							<textarea
								matInput
								formControlName="tasks"
								style="min-height: 200px"
								[errorStateMatcher]="matcher"
								maxlength="1000"
							></textarea>
							<mat-hint>Maximum 1000 characters</mat-hint>
							<mat-error *ngIf="form.get('tasks')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepGdsdDogTasksComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.gdsdApplicationService.dogTasksFormGroup;

	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
