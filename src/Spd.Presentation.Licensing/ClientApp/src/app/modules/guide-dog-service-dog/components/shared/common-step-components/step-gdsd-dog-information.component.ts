import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { GenderMFTypes } from '@app/core/code-types/model-desc.models';
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
										formControlName="dateOfBirth"
										[max]="maxBirthDate"
										[min]="minDate"
										[errorStateMatcher]="matcher"
									/>
									<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
									<mat-datepicker #picker startView="multi-year"></mat-datepicker>
									<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
									<mat-error *ngIf="form.get('dateOfBirth')?.hasError('matDatepickerMin')">
										Invalid date of birth
									</mat-error>
									<mat-error *ngIf="form.get('dateOfBirth')?.hasError('matDatepickerMax')">
										This must be on or before {{ maxBirthDate | formatDate }}
									</mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Breed</mat-label>
									<input matInput formControlName="breed" [errorStateMatcher]="matcher" maxlength="50" />
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Colour And Markings</mat-label>
									<input matInput formControlName="colourAndMarkings" [errorStateMatcher]="matcher" maxlength="50" />
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Gender</mat-label>
									<mat-select formControlName="genderCode" [errorStateMatcher]="matcher">
										<mat-option *ngFor="let gdr of genderMfTypes; let i = index" [value]="gdr.code">
											{{ gdr.desc }}
										</mat-option>
									</mat-select>
									<mat-error *ngIf="form.get('genderCode')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Microchip Number <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="microchipNumber" maxlength="50" />
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

	genderMfTypes = GenderMFTypes;
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
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}
}
