import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-team-training-history',
	template: `
		<app-step-section
			heading="Training History Information"
			subheading="Please provide as much detail as possible about your dog’s training history, including
any joint training you and your dog have completed."
		>
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-6 col-lg-10 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="text-minor-heading lh-base mt-3 mb-2">
								Have you attended a training school(s) and/or program(s)?
							</div>

							<div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group
									aria-label="Select an option"
									formControlName="hasAttendedTrainingSchool"
									(change)="onChangeDocumentType($event)"
								>
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
export class StepTeamTrainingHistoryComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.gdsdTeamApplicationService.trainingHistoryFormGroup;

	booleanTypeCodes = BooleanTypeCode;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onChangeDocumentType(_event: MatRadioChange): void {
		this.gdsdTeamApplicationService.hasValueChanged = true;
		this.schoolattachments.setValue([]);
		this.otherattachments.setValue([]);
		this.logattachments.setValue([]);
	}

	get schoolattachments(): FormControl {
		return this.gdsdTeamApplicationService.schoolTrainingHistoryFormGroup.get('attachments') as FormControl;
	}
	get otherattachments(): FormControl {
		return this.gdsdTeamApplicationService.otherTrainingHistoryFormGroup.get('attachments') as FormControl;
	}
	get logattachments(): FormControl {
		return this.gdsdTeamApplicationService.otherTrainingHistoryFormGroup.get('practiceLogAttachments') as FormControl;
	}
}
