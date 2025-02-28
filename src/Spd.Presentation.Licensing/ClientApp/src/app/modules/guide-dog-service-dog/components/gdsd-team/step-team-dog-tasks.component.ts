import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-team-dog-tasks',
	template: `
		<app-step-section
			title="Specialized tasks"
			subtitle="Provide a list of the specialized tasks your dog performs to help you with day-to-day living."
		>
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="col-12 mt-3">
							<app-alert type="info" icon="info">
								Examples of these include:
								<ul>
									<li>Dog fetches my medications when I need them.</li>
									<li>Dog alerts to telephone ring.</li>
									<li>Dog pushes me to a safe place when an epileptic seizure is imminent.</li>
									<li>Dog picks up clothing or items for me when I am dressing.</li>
									<li>
										Dog prevents (autistic) child from running away when outside and the child starts moving away from
										close proximity to dog/caregiver.
									</li>
								</ul>
							</app-alert>
						</div>

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
export class StepTeamDogTasksComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.gdsdTeamApplicationService.dogTasksFormGroup;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
