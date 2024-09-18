import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GenderTypes } from 'src/app/core/code-types/model-desc.models';
import { UtilService } from 'src/app/core/services/util.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { AppInviteOrgData, CrcFormStepComponent } from '../screening-application.model';

@Component({
	selector: 'app-sa-personal-information',
	template: `
		<section class="step-section p-3" *ngIf="orgData">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title
						title="Your personal information"
						subtitle="Date of birth must match your government-issued identification"
					></app-step-title>
					<div class="row">
						<div class="offset-lg-2 col-lg-4 col-md-12 col-sm-12">
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
								<mat-datepicker #picker startView="multi-year"></mat-datepicker>
								<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('dateOfBirth')?.hasError('matDatepickerMax')">
									This must be on or before {{ maxBirthDate | formatDate }}
								</mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-4 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>Birthplace</mat-label>
								<input
									matInput
									formControlName="birthPlace"
									placeholder="City, Country"
									[errorStateMatcher]="matcher"
									maxlength="100"
								/>
								<mat-error *ngIf="form.get('birthPlace')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="offset-lg-2 col-lg-4 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>BC Drivers Licence # <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="driversLicense" mask="00000009" />
								<mat-error *ngIf="form.get('driversLicense')?.hasError('mask')"> This must be 7 or 8 digits </mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-4 col-md-12 col-sm-12">
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
					<div class="row" *ngIf="orgData.bcGovEmployeeIdShow">
						<div class="offset-lg-2 col-lg-4 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>BC Government Employee ID <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="employeeId" mask="000000" />
								<mat-error *ngIf="form.get('employeeId')?.hasError('mask')"> This must be 6 digits </mat-error>
							</mat-form-field>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [],
})
export class SaPersonalInformationComponent implements CrcFormStepComponent {
	private _orgData: AppInviteOrgData | null = null;
	@Input()
	set orgData(data: AppInviteOrgData | null) {
		if (!data) return;

		this._orgData = data;
		this.form = this.formBuilder.group({
			birthPlace: new FormControl(data.birthPlace, [FormControlValidators.required]),
			driversLicense: new FormControl(data.driversLicense),
			dateOfBirth: new FormControl({ value: data.dateOfBirth, disabled: data.readonlyTombstone ?? false }, [
				Validators.required,
			]),
			employeeId: new FormControl(data.employeeId),
			genderCode: new FormControl(data.genderCode),
		});
	}
	get orgData(): AppInviteOrgData | null {
		return this._orgData;
	}

	genderTypes = GenderTypes;
	form!: FormGroup;
	matcher = new FormErrorStateMatcher();

	maxBirthDate = this.utilService.getBirthDateMax();

	constructor(private formBuilder: FormBuilder, private utilService: UtilService) {}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
