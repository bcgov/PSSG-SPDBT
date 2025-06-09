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
			subtitle="Describe the specific tasks your dog is trained to do that help with your daily life."
		>
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="col-12 mt-3">
							<app-alert type="info" icon="info">
								Here are some examples:
								<ul>
									<li>My dog brings me my medication when I need it.</li>
									<li>My dog alerts me when the phone rings.</li>
									<li>My dog moves me to a safe place when I’m about to have a seizure.</li>
									<li>My dog picks up clothing or other items to help me get dressed.</li>
									<li>
										My dog helps keep my (autistic) child safe by staying close and preventing them from running off.
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
