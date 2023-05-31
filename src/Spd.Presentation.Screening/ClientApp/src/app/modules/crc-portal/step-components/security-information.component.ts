import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { AppInviteOrgData, CrcFormStepComponent } from '../crc.component';

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
								<input matInput formControlName="orgName" />
							</mat-form-field>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Organization Email</mat-label>
								<input matInput formControlName="orgEmail" />
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Organization Phone Number</mat-label>
								<input matInput formControlName="orgPhoneNumber" [mask]="phoneMask" [showMaskTyped]="true" />
							</mat-form-field>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Organization Address</mat-label>
								<input matInput formControlName="address" />
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
								<input matInput formControlName="vulnerableSectorCategoryDesc" />
							</mat-form-field>
						</div>
					</div>
					<div class="row" *ngIf="orgData._facilityNameRequired">
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
	private _orgData!: AppInviteOrgData;
	@Input()
	set orgData(data: AppInviteOrgData) {
		this._orgData = data;
		this.form = this.formBuilder.group(
			{
				orgName: new FormControl({ value: this.orgData.orgName, disabled: true }),
				orgPhoneNumber: new FormControl({ value: this.orgData.orgPhoneNumber, disabled: true }),
				address: new FormControl({ value: this.orgData._address, disabled: true }),
				orgEmail: new FormControl({ value: this.orgData.orgEmail, disabled: true }),
				jobTitle: new FormControl(this.orgData.jobTitle, [Validators.required]),
				vulnerableSectorCategoryDesc: new FormControl({
					value: this.orgData._worksWithDesc,
					disabled: true,
				}),
				facilityName: new FormControl('', [Validators.required]),
			},
			{
				validators: [
					FormGroupValidators.conditionalRequiredValidator(
						'facilityName',
						(form) => this.orgData._facilityNameRequired ?? false
					),
				],
			}
		);
	}
	get orgData(): AppInviteOrgData {
		return this._orgData;
	}

	phoneMask = SPD_CONSTANTS.phone.displayMask;
	form!: FormGroup;
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder) {}

	getDataToSave(): any {
		return this.form.value;
	}

	setStepData(data: any): void {
		this.form.patchValue({
			orgName: data.orgName,
			orgPhoneNumber: data.orgPhoneNumber,
			address: data.address,
			orgEmail: data.orgEmail,
			jobTitle: data.jobTitle,
			vulnerableSectorCategory: data.vulnerableSectorCategory,
			facilityName: data.facilityName,
		});
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
