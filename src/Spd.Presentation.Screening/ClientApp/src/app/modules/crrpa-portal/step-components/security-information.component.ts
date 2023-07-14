import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode, ScreeningTypeCode } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { AppInviteOrgData, CrcFormStepComponent } from '../crrpa.component';

@Component({
	selector: 'app-security-information',
	template: `
		<section class="step-section p-3" *ngIf="orgData">
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
								<input matInput formControlName="orgAddress" />
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
					<div class="row" *ngIf="facilityNameShow">
						<div class="offset-lg-2 col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Company / Facility Name</mat-label>
								<input matInput formControlName="contractedCompanyName" />
								<mat-hint>(Licensed Child Care Name or Adult Care Facility Name)</mat-hint>
								<mat-error *ngIf="form.get('contractedCompanyName')?.hasError('required')">This is required</mat-error>
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
	facilityNameShow = false;
	facilityNameRequired = false;

	private _orgData: AppInviteOrgData | null = null;
	@Input()
	set orgData(data: AppInviteOrgData | null) {
		if (!data) return;

		this._orgData = data;

		if (data.screeningType) {
			// If coming from Portal Invitation (screeningType is provided). If shown, always required.
			this.facilityNameRequired = [ScreeningTypeCode.Contractor, ScreeningTypeCode.Licensee].includes(
				data.screeningType!
			);
			this.facilityNameShow = this.facilityNameRequired;
		} else {
			// If coming from Access Code page, use these flags to determine if field is shown. If shown, always optional
			this.facilityNameShow =
				data.contractorsNeedVulnerableSectorScreening! == BooleanTypeCode.Yes ||
				data.licenseesNeedVulnerableSectorScreening! == BooleanTypeCode.Yes
					? true
					: false;
			this.facilityNameRequired = false;
		}

		this.form = this.formBuilder.group(
			{
				orgName: new FormControl({ value: data.orgName, disabled: true }),
				orgPhoneNumber: new FormControl({ value: data.orgPhoneNumber, disabled: true }),
				orgAddress: new FormControl({ value: data.orgAddress, disabled: true }),
				orgEmail: new FormControl({ value: data.orgEmail, disabled: true }),
				jobTitle: new FormControl(data.jobTitle, [FormControlValidators.required]),
				vulnerableSectorCategoryDesc: new FormControl({
					value: this.optionsPipe.transform(data.worksWith, 'EmployeeInteractionTypes'),
					disabled: true,
				}),
				contractedCompanyName: new FormControl(data.contractedCompanyName, [FormControlValidators.required]),
			},
			{
				validators: [
					FormGroupValidators.conditionalRequiredValidator(
						'contractedCompanyName',
						(form) => this.facilityNameRequired
					),
				],
			}
		);
	}
	get orgData(): AppInviteOrgData | null {
		return this._orgData;
	}

	phoneMask = SPD_CONSTANTS.phone.displayMask;
	form!: FormGroup;
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder, private optionsPipe: OptionsPipe) {}

	getDataToSave(): any {
		return this.form.value;
	}

	setStepData(data: any): void {
		this.form.patchValue({
			orgName: data.orgName,
			orgPhoneNumber: data.orgPhoneNumber,
			orgAddress: data.orgAddress,
			orgEmail: data.orgEmail,
			jobTitle: data.jobTitle,
			vulnerableSectorCategory: this.optionsPipe.transform(data.worksWith, 'EmployeeInteractionTypes'),
			contractedCompanyName: data.contractedCompanyName,
		});
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
