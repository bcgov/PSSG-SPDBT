import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { CrcFormStepComponent, CrcRequestCreateRequest } from '../crc.component';

@Component({
	selector: 'app-security-information',
	template: `
		<section class="step-section p-3">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title
						title="Confirm the following information related to your criminal record check"
					></app-step-title>
					<div class="row">
						<div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Requesting Organization</mat-label>
								<input matInput formControlName="organizationName" />
							</mat-form-field>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Organization Email</mat-label>
								<input matInput formControlName="organizationEmail" />
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Organization Phone Number</mat-label>
								<input matInput formControlName="organizationPhoneNumber" [mask]="phoneMask" [showMaskTyped]="true" />
							</mat-form-field>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Organization Address</mat-label>
								<input matInput formControlName="organizationAddress" />
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Job Title</mat-label>
								<input matInput formControlName="jobTitle" [errorStateMatcher]="matcher" maxlength="100" />
								<mat-error *ngIf="form.get('jobTitle')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Vulnerable Sector Category</mat-label>
								<input matInput formControlName="vulnerableSectorCategory" />
							</mat-form-field>
						</div>
					</div>
					<div class="row" *ngIf="orgData.facilityNameRequired">
						<div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Facility Name</mat-label>
								<input matInput formControlName="facilityName" />
								<mat-hint>(Licensed Child Care Name or Adult Care Facility Name)</mat-hint>
								<mat-error *ngIf="form.get('facilityName')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [],
})
export class SecurityInformationComponent implements CrcFormStepComponent {
	private _orgData!: CrcRequestCreateRequest;
	@Input()
	set orgData(data: CrcRequestCreateRequest) {
		this._orgData = data;
		this.form = this.formBuilder.group(
			{
				organizationName: new FormControl({ value: this.orgData.orgName, disabled: true }),
				organizationPhoneNumber: new FormControl({ value: this.orgData.orgPhoneNumber, disabled: true }),
				organizationAddress: new FormControl({ value: this.orgData.address, disabled: true }),
				organizationEmail: new FormControl({ value: this.orgData.orgEmail, disabled: true }),
				jobTitle: new FormControl(this.orgData.jobTitle, [Validators.required]),
				vulnerableSectorCategory: new FormControl({ value: this.orgData.vulnerableSectorCategoryDesc, disabled: true }),
				facilityName: new FormControl('', [Validators.required]),
			},
			{
				validators: [
					FormGroupValidators.conditionalRequiredValidator(
						'facilityName',
						(form) => this.orgData.facilityNameRequired ?? false
					),
				],
			}
		);
	}
	get orgData(): CrcRequestCreateRequest {
		return this._orgData;
	}

	phoneMask = SPD_CONSTANTS.phone.displayMask;
	form!: FormGroup;
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder) {}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
