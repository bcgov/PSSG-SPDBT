import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { DogGenderTypes, SelectOptions } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
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
									formControlName="dogDateOfBirth"
									[mask]="dateMask"
									[showMaskTyped]="true"
									[errorStateMatcher]="matcher"
									(blur)="onValidateDate()"
									aria-label="Date in format YYYY-MM-DD"
								/>
								<!-- We always want the date format hint to display -->
								<mat-hint *ngIf="!showHintError">Date format YYYY-MM-DD</mat-hint>
								<mat-error *ngIf="showHintError">
									<span class="hint-inline">Date format YYYY-MM-DD</span>
								</mat-error>
								<mat-error *ngIf="dogDateOfBirth?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="dogDateOfBirth?.hasError('invalidDate')">This date is invalid</mat-error>
								<mat-error *ngIf="dogDateOfBirth?.hasError('futureDate')">This date cannot be in the future</mat-error>
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
	genderMfTypes: SelectOptions[] = DogGenderTypes;
	matcher = new FormErrorStateMatcher();

	dateMask = SPD_CONSTANTS.date.dateMask;

	@Input() form!: FormGroup;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private utilService: UtilService) {}

	ngOnInit(): void {
		if (this.isNew) {
			this.utilService.enableInputs(this.form);
		} else {
			this.utilService.disableInputs(this.form, ['microchipNumber']);
		}
	}

	onValidateDate(): void {
		const errorKey = this.utilService.getIsInputValidDate(this.dogDateOfBirth.value, true);
		if (errorKey) {
			this.dogDateOfBirth.setErrors({ [errorKey]: true });
		}
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
	get showHintError(): boolean {
		return (this.dogDateOfBirth?.dirty || this.dogDateOfBirth?.touched) && this.dogDateOfBirth?.invalid;
	}
	get dogDateOfBirth(): FormControl {
		return this.form.get('dogDateOfBirth') as FormControl;
	}
}
