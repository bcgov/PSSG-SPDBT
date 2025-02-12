import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, GenderCode } from '@app/api/models';
import { BooleanTypeCode, GenderTypes, SelectOptions } from '@app/core/code-types/model-desc.models';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-gdsd-dog-information',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Dog Name</mat-label>
									<input matInput formControlName="dogName" [errorStateMatcher]="matcher" maxlength="50" />
									<mat-error *ngIf="form.get('dogName')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Date of Birth</mat-label>
									<input
										matInput
										[matDatepicker]="picker"
										formControlName="dogDateOfBirth"
										[max]="maxBirthDate"
										[min]="minDate"
										[errorStateMatcher]="matcher"
									/>
									<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
									<mat-datepicker #picker startView="multi-year"></mat-datepicker>
									<mat-error *ngIf="form.get('dogDateOfBirth')?.hasError('required')">This is required</mat-error>
									<mat-error *ngIf="form.get('dogDateOfBirth')?.hasError('matDatepickerMin')">
										Invalid date of birth
									</mat-error>
									<mat-error *ngIf="form.get('dogDateOfBirth')?.hasError('matDatepickerMax')">
										This must be on or before {{ maxBirthDate | formatDate }}
									</mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Breed</mat-label>
									<input matInput formControlName="dogBreed" [errorStateMatcher]="matcher" maxlength="50" />
									<mat-error *ngIf="form.get('dogBreed')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Colour And Markings</mat-label>
									<input matInput formControlName="dogColorAndMarkings" [errorStateMatcher]="matcher" maxlength="50" />
									<mat-error *ngIf="form.get('dogColorAndMarkings')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Gender</mat-label>
									<mat-select formControlName="dogGender" [errorStateMatcher]="matcher">
										<mat-option *ngFor="let gdr of genderMfTypes; let i = index" [value]="gdr.code">
											{{ gdr.desc }}
										</mat-option>
									</mat-select>
									<mat-error *ngIf="form.get('dogGender')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Microchip Number <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="microchipNumber" maxlength="50" />
								</mat-form-field>
							</div>
						</div>
					</form>
					<ng-container *ngIf="isTrainedByAccreditedSchools">
						<form [formGroup]="dogGdsdForm" novalidate>
							<mat-divider class="mb-2 mt-4 mat-divider-primary"></mat-divider>
							<div class="row">
								<div class="fs-5 lh-base mt-3 mb-2">Is your dog trained as a Guide Dog or a Service Dog?</div>

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
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepGdsdDogInformationComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	title = '';
	subtitle = '';

	genderMfTypes: SelectOptions[] = [];
	matcher = new FormErrorStateMatcher();

	maxBirthDate = this.utilService.getDogBirthDateMax();
	minDate = this.utilService.getDogDateMin();

	form: FormGroup = this.gdsdApplicationService.dogInformationFormGroup;
	dogGdsdForm: FormGroup = this.gdsdApplicationService.dogGdsdFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() isTrainedByAccreditedSchools!: boolean;

	constructor(
		private utilService: UtilService,
		private gdsdApplicationService: GdsdApplicationService
	) {}

	ngOnInit(): void {
		this.title = this.isRenewal ? 'Confirm your Dog Information' : 'Your Dog Information';
		this.subtitle = this.isRenewal ? 'Update any information that has changed since your last application' : '';

		this.genderMfTypes = GenderTypes.filter(
			(item: SelectOptions) => item.code === GenderCode.F || item.code === GenderCode.M
		);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		if (!this.isTrainedByAccreditedSchools) {
			return this.form.valid;
		}

		this.dogGdsdForm.markAllAsTouched();
		return this.form.valid && this.dogGdsdForm.valid;
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}
}
