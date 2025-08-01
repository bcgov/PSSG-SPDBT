import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GenderTypes } from '@app/core/code-types/model-desc.models';
import { UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-form-personal-information-new-anonymous',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Given Name</mat-label>
								<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
							</mat-form-field>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="middleName1" maxlength="40" />
							</mat-form-field>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="middleName2" maxlength="40" />
							</mat-form-field>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Surname</mat-label>
								<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
								@if (form.get('surname')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
							</mat-form-field>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-12">
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
								@if (form.get('dateOfBirth')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
								@if (form.get('dateOfBirth')?.hasError('matDatepickerMin')) {
									<mat-error>Invalid date of birth</mat-error>
								}
								@if (form.get('dateOfBirth')?.hasError('matDatepickerMax')) {
									<mat-error>This must be on or before {{ maxBirthDate | formatDate }}</mat-error>
								}
							</mat-form-field>
						</div>

						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Sex</mat-label>
								<mat-select formControlName="genderCode" [errorStateMatcher]="matcher">
									@for (gdr of genderTypes; track gdr; let i = $index) {
										<mat-option [value]="gdr.code">{{ gdr.desc }}</mat-option>
									}
								</mat-select>
								@if (form.get('genderCode')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
							</mat-form-field>
						</div>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
	standalone: false,
})
export class FormPersonalInformationNewAnonymousComponent implements OnInit {
	genderTypes = GenderTypes;
	matcher = new FormErrorStateMatcher();

	maxBirthDate = this.utilService.getBirthDateMax();
	minDate = this.utilService.getDateMin();

	@Input() form!: FormGroup;

	constructor(private utilService: UtilService) {}

	ngOnInit(): void {
		// fields may have been previously disabled if user was using
		// this formGroup (personalInformationFormGroup) in a different component.
		// for example, if the user does an 'update' (which displays the fields as readonly),
		// then does a 'new' - fields would display as disabled.
		this.enableData();
	}

	private enableData(): void {
		this.surname.enable({ emitEvent: false });
		this.givenName.enable({ emitEvent: false });
		this.middleName1.enable({ emitEvent: false });
		this.middleName2.enable({ emitEvent: false });
		this.genderCode.enable({ emitEvent: false });
		this.dateOfBirth.enable({ emitEvent: false });
	}

	get surname(): FormControl {
		return this.form.get('surname') as FormControl;
	}
	get givenName(): FormControl {
		return this.form.get('givenName') as FormControl;
	}
	get middleName1(): FormControl {
		return this.form.get('middleName1') as FormControl;
	}
	get middleName2(): FormControl {
		return this.form.get('middleName2') as FormControl;
	}
	get dateOfBirth(): FormControl {
		return this.form.get('dateOfBirth') as FormControl;
	}
	get genderCode(): FormControl {
		return this.form.get('genderCode') as FormControl;
	}
}
