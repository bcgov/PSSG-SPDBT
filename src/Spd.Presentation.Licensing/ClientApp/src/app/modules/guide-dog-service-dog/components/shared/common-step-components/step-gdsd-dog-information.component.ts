import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, GenderCode } from '@app/api/models';
import { GenderTypes, SelectOptions } from '@app/core/code-types/model-desc.models';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-gdsd-dog-information',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Dog Name</mat-label>
									<input matInput formControlName="dogName" [errorStateMatcher]="matcher" maxlength="50" />
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
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Colour And Markings</mat-label>
									<input matInput formControlName="dogColorAndMarkings" [errorStateMatcher]="matcher" maxlength="50" />
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

							<div class="col-12">
								<div class="text-minor-heading mt-3 mb-2">Tasks the dog does to assist you with daily living</div>
								<mat-form-field>
									<textarea
										matInput
										formControlName="serviceDogTasks"
										style="min-height: 200px"
										[errorStateMatcher]="matcher"
										maxlength="1000"
									></textarea>
									<mat-hint>Maximum 1000 characters</mat-hint>
									<mat-error *ngIf="form.get('serviceDogTasks')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
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
export class StepGdsdDogInformationComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	genderMfTypes: SelectOptions[] = [];
	matcher = new FormErrorStateMatcher();

	maxBirthDate = this.utilService.getBirthDateMax();
	minDate = this.utilService.getDateMin();

	form: FormGroup = this.gdsdApplicationService.dogInformationFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(
		private utilService: UtilService,
		private gdsdApplicationService: GdsdApplicationService
	) {}

	ngOnInit(): void {
		this.title = this.isRenewal ? 'Confirm your dog information' : 'Your dog information';
		this.subtitle = this.isRenewal
			? 'Update any information that has changed since your last application'
			: 'Provide information about your dog';

		this.genderMfTypes = GenderTypes.filter(
			(item: SelectOptions) => item.code === GenderCode.F || item.code === GenderCode.M
		);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}
}
