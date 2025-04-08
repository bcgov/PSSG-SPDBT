import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-team-dog-service-info',
	template: `
		<app-step-section [title]="title">
			<div class="row">
				<div class="col-xxl-6 col-xl-7 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<ng-container *ngIf="showDogServiceStep">
						<form [formGroup]="dogGdsdForm" novalidate>
							<div class="row">
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
					<ng-container *ngIf="showRenewStep">
						<form [formGroup]="dogRenewForm" novalidate>
							<div class="row">
								<div class="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 mx-auto">
									<mat-radio-group aria-label="Select an option" formControlName="isAssistanceStillRequired">
										<div class="d-flex justify-content-start">
											<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
											<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
										</div>
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
export class StepTeamDogServiceInfoComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	title = '';

	dogGdsdForm: FormGroup = this.gdsdTeamApplicationService.dogGdsdFormGroup;
	dogRenewForm: FormGroup = this.gdsdTeamApplicationService.dogRenewFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isTrainedByAccreditedSchools!: boolean;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	ngOnInit(): void {
		this.title = this.showDogServiceStep
			? 'Is your dog trained as a Guide Dog or a Service Dog?'
			: "Do you continue to require the dog's assistance for daily living as a result of blindness, visual impairment or another disability?";
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
