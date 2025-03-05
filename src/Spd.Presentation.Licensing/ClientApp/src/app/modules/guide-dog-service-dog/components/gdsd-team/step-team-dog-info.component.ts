import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-team-dog-info',
	template: `
		<app-step-section [title]="title">
			<app-form-gdsd-dog-info [form]="form" [applicationTypeCode]="applicationTypeCode"></app-form-gdsd-dog-info>

			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<ng-container *ngIf="isNew && isTrainedByAccreditedSchools">
						<form [formGroup]="dogGdsdForm" novalidate>
							<mat-divider class="mb-2 mt-4 mat-divider-primary"></mat-divider>
							<div class="row">
								<div class="text-minor-heading lh-base mt-3 mb-2">
									Is your dog trained as a Guide Dog or a Service Dog?
								</div>

								<div class="col-xxl-10 col-xl-12 mx-auto">
									<mat-radio-group aria-label="Select an option" formControlName="isGuideDog">
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">
											Guide dog (Trained as a guide for a blind person)
										</mat-radio-button>
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">
											Service dog (Trained to perform specific tasks to assist a person with a disability)
										</mat-radio-button>
									</mat-radio-group>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(dogGdsdForm.get('isGuideDog')?.dirty || dogGdsdForm.get('isGuideDog')?.touched) &&
											dogGdsdForm.get('isGuideDog')?.invalid &&
											dogGdsdForm.get('isGuideDog')?.hasError('required')
										"
										>This is required</mat-error
									>
								</div>
							</div>
						</form>
					</ng-container>
					<ng-container *ngIf="!isNew">
						<form [formGroup]="dogRenewForm" novalidate>
							<mat-divider class="mb-2 mt-4 mat-divider-primary"></mat-divider>
							<div class="row">
								<div class="text-minor-heading lh-base mt-3 mb-2">
									Do you continue to require the dog's assistance for daily living as a result of blindness, visual
									impairment or another disability?
								</div>

								<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
									<mat-radio-group aria-label="Select an option" formControlName="isAssistanceStillRequired">
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes"> Yes </mat-radio-button>
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No"> No </mat-radio-button>
									</mat-radio-group>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(dogRenewForm.get('isAssistanceStillRequired')?.dirty ||
												dogRenewForm.get('isAssistanceStillRequired')?.touched) &&
											dogRenewForm.get('isAssistanceStillRequired')?.invalid &&
											dogRenewForm.get('isAssistanceStillRequired')?.hasError('required')
										"
										>This is required</mat-error
									>
								</div>
							</div>
						</form>
					</ng-container>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepTeamDogInfoComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	title = '';

	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.gdsdTeamApplicationService.dogInfoFormGroup;
	dogGdsdForm: FormGroup = this.gdsdTeamApplicationService.dogGdsdFormGroup;
	dogRenewForm: FormGroup = this.gdsdTeamApplicationService.dogRenewFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isTrainedByAccreditedSchools!: boolean;

	constructor(
		private utilService: UtilService,
		private gdsdTeamApplicationService: GdsdTeamApplicationService
	) {}

	ngOnInit(): void {
		this.title = this.isNew ? 'Your dog information' : 'Confirm your dog information';

		if (this.isNew) {
			this.utilService.enableInputs(this.form);
		} else {
			this.utilService.disableInputs(this.form, ['microchipNumber']);
		}
	}

	isFormValid(): boolean {
		if (this.isNew) {
			this.form.markAllAsTouched();
			if (!this.isTrainedByAccreditedSchools) {
				return this.form.valid;
			}

			this.dogGdsdForm.markAllAsTouched();
			return this.form.valid && this.dogGdsdForm.valid;
		}

		this.dogRenewForm.markAllAsTouched();
		return this.dogRenewForm.valid;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
}
