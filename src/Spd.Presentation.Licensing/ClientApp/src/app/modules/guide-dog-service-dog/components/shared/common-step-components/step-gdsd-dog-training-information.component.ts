import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-gdsd-dog-training-information',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="fs-5 lh-base mt-3 mb-2">
								Is your dog trained by Assistance Dogs International or International Guide Dog Federation accredited
								schools?
							</div>
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12">
								<mat-radio-group aria-label="Select an option" formControlName="isDogTrainedByAccreditedSchool">
									<div class="d-flex justify-content-start">
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
									</div>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('isDogTrainedByAccreditedSchool')?.dirty ||
											form.get('isDogTrainedByAccreditedSchool')?.touched) &&
										form.get('isDogTrainedByAccreditedSchool')?.invalid &&
										form.get('isDogTrainedByAccreditedSchool')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
							<mat-divider class="mt-4 mb-2"></mat-divider>
						</div>
						<div class="row">
							<div class="fs-5 lh-base mt-3 mb-2">Is your dog trained as a Guide Dog or a Service Dog?</div>
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12">
								<mat-radio-group aria-label="Select an option" formControlName="isGuideDog">
									<div class="d-flex justify-content-start">
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
									</div>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('isGuideDog')?.dirty || form.get('isGuideDog')?.touched) &&
										form.get('isGuideDog')?.invalid &&
										form.get('isGuideDog')?.hasError('required')
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
export class StepGdsdDogTrainingInformationComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.gdsdApplicationService.dogTrainingInformationFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	ngOnInit(): void {
		this.title = this.isRenewal ? 'Confirm your dog training information' : 'Your dog training information';
		this.subtitle = this.isRenewal ? 'Update any information that has changed since your last application' : '';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}
}
