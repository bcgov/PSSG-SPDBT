import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GenderTypes } from 'src/app/core/code-types/model-desc.models';
import { UtilService } from 'src/app/core/services/util.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-personal-information',
	template: `
		<div class="step">
			<app-step-title title="Your personal information"></app-step-title>
			<div class="step-container row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<mat-checkbox formControlName="oneLegalName"> I have one legal name </mat-checkbox>
						<div class="row">
							<div class="col-xl-3 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Legal Given Name</mat-label>
									<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('givenName')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>
							<div class="col-xl-3 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="middleName1" maxlength="40" />
								</mat-form-field>
							</div>
							<div class="col-xl-3 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="middleName2" maxlength="40" />
								</mat-form-field>
							</div>
							<div class="col-xl-3 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Legal Surname</mat-label>
									<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>

							<div class="col-xl-3 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Date of Birth</mat-label>
									<input
										matInput
										[matDatepicker]="picker"
										formControlName="dateOfBirth"
										[max]="maxBirthDate"
										[errorStateMatcher]="matcher"
									/>
									<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
									<mat-datepicker #picker startView="multi-year" [startAt]="startAtBirthDate"></mat-datepicker>
									<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-xl-3 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Sex <span class="optional-label">(optional)</span></mat-label>
									<mat-select formControlName="genderCode">
										<mat-option *ngFor="let gdr of genderTypes" [value]="gdr.code">
											{{ gdr.desc }}
										</mat-option>
									</mat-select>
								</mat-form-field>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class PersonalInformationComponent {
	genderTypes = GenderTypes;
	matcher = new FormErrorStateMatcher();

	startAtBirthDate = this.utilService.getBirthDateStartAt();
	maxBirthDate = this.utilService.getBirthDateMax();

	form: FormGroup = this.formBuilder.group(
		{
			givenName: new FormControl('', [FormControlValidators.required]),
			middleName1: new FormControl(''),
			middleName2: new FormControl(''),
			surname: new FormControl('', [FormControlValidators.required]),
			oneLegalName: new FormControl(false),
			genderCode: new FormControl(''),
			dateOfBirth: new FormControl(null, [Validators.required]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'givenName',
					(form) => form.get('oneLegalName')?.value != true
				),
			],
		}
	);

	constructor(private formBuilder: FormBuilder, private utilService: UtilService) {}
}
