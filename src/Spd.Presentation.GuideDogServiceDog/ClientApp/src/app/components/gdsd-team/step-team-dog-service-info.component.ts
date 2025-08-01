import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-team-dog-service-info',
	template: `
		<app-step-section [heading]="title">
			<div class="row">
				<div class="col-xxl-6 col-xl-7 col-lg-12 col-md-12 col-sm-12 mx-auto">
					@if (showDogServiceStep) {
						<form [formGroup]="dogGdsdForm" novalidate>
							<div class="row">
								<div class="col-xxl-10 col-xl-12 mx-auto">
									<mat-radio-group aria-label="Select an option" formControlName="isGuideDog">
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">
											{{ guideDogLabel }}
										</mat-radio-button>
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">
											{{ serviceDogLabel }}
										</mat-radio-button>
									</mat-radio-group>
									@if (
										(dogGdsdForm.get('isGuideDog')?.dirty || dogGdsdForm.get('isGuideDog')?.touched) &&
										dogGdsdForm.get('isGuideDog')?.invalid &&
										dogGdsdForm.get('isGuideDog')?.hasError('required')
									) {
										<mat-error>This is required</mat-error>
									}
								</div>
							</div>
						</form>
					}
					@if (showRenewStep) {
						<form [formGroup]="dogRenewForm" novalidate>
							<div class="row">
								<div class="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 mx-auto">
									<mat-radio-group aria-label="Select an option" formControlName="isAssistanceStillRequired">
										<div class="d-flex justify-content-start">
											<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
											<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
										</div>
									</mat-radio-group>
									@if (
										(dogRenewForm.get('isAssistanceStillRequired')?.dirty ||
											dogRenewForm.get('isAssistanceStillRequired')?.touched) &&
										dogRenewForm.get('isAssistanceStillRequired')?.invalid &&
										dogRenewForm.get('isAssistanceStillRequired')?.hasError('required')
									) {
										<mat-error>This is required</mat-error>
									}
								</div>
							</div>
						</form>
					}
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepTeamDogServiceInfoComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	title = '';

	guideDogLabel = SPD_CONSTANTS.label.guideDogLabel;
	serviceDogLabel = SPD_CONSTANTS.label.serviceDogLabel;

	dogGdsdForm: FormGroup = this.gdsdTeamApplicationService.dogGdsdFormGroup;
	dogRenewForm: FormGroup = this.gdsdTeamApplicationService.dogRenewFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isTrainedByAccreditedSchools!: boolean;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	ngOnInit(): void {
		this.title = this.showDogServiceStep
			? 'What type of trained dog do you have?'
			: 'Do you still rely on your dog’s assistance for daily living due to blindness, visual impairment, or another disability?';
	}

	isFormValid(): boolean {
		if (this.showDogServiceStep) {
			this.dogGdsdForm.markAllAsTouched();
			return this.dogGdsdForm.valid;
		}

		if (this.showRenewStep) {
			this.dogRenewForm.markAllAsTouched();
			return this.dogRenewForm.valid;
		}

		return true;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
	get showDogServiceStep(): boolean {
		return this.isNew && this.isTrainedByAccreditedSchools;
	}
	get showRenewStep(): boolean {
		return !this.isNew;
	}
}
