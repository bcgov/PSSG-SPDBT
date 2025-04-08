import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, GenderCode } from '@app/api/models';
import { GenderTypes, SelectOptions } from '@app/core/code-types/model-desc.models';
import { UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-form-gdsd-dog-info',
	template: `
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
								<mat-label>Colour and Markings</mat-label>
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
			</div>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class FormGdsdDogInfoComponent implements OnInit {
	genderMfTypes: SelectOptions[] = [];
	matcher = new FormErrorStateMatcher();

	maxBirthDate = this.utilService.getDogBirthDateMax();
	minDate = this.utilService.getDogDateMin();

	@Input() form!: FormGroup;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private utilService: UtilService) {}

	ngOnInit(): void {
		this.genderMfTypes = GenderTypes.filter(
			(item: SelectOptions) => item.code === GenderCode.F || item.code === GenderCode.M
		);

		if (this.isNew) {
			this.utilService.enableInputs(this.form);
		} else {
			this.utilService.disableInputs(this.form, ['microchipNumber']);
		}
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
}
