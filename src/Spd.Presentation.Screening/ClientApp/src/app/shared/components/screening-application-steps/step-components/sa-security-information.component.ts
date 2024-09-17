import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode, ScreeningTypeCode } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { AppInviteOrgData, CrcFormStepComponent } from '../screening-application.model';

@Component({
	selector: 'app-sa-security-information',
	template: `
		<section class="step-section p-3" *ngIf="orgData">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title
						title="Confirm the following information related to your criminal record check"
					></app-step-title>
					<div class="row">
						<div class="col-lg-8 col-md-12 col-sm-12 mx-auto">
							<div class="row">
								<div class="col-xl-6 col-lg-12 col-md-12 col-sm-12">
									<mat-form-field>
										<mat-label>
											<span *ngIf="orgData.isCrrpa">Requesting Organization</span>
											<span *ngIf="!orgData.isCrrpa">Ministry</span>
										</mat-label>
										<input matInput formControlName="orgName" />
									</mat-form-field>
								</div>
								<div class="col-xl-6 col-lg-12 col-md-12 col-sm-12" *ngIf="orgData.isCrrpa">
									<mat-form-field>
										<mat-label>Organization Email</mat-label>
										<input matInput formControlName="orgEmail" />
									</mat-form-field>
								</div>
								<ng-container *ngIf="orgData.isCrrpa">
									<div class="col-xl-6 col-lg-12 col-md-12 col-sm-12">
										<mat-form-field>
											<mat-label>Organization Phone Number</mat-label>
											<input matInput formControlName="orgPhoneNumber" [mask]="phoneMask" [showMaskTyped]="false" />
										</mat-form-field>
									</div>
									<div class="col-xl-6 col-lg-12 col-md-12 col-sm-12">
										<mat-form-field>
											<mat-label>Organization Address</mat-label>
											<input matInput formControlName="orgAddress" />
										</mat-form-field>
									</div>
								</ng-container>
								<div class="col-xl-6 col-lg-12 col-md-12 col-sm-12">
									<mat-form-field>
										<mat-label>Job Title</mat-label>
										<input matInput formControlName="jobTitle" [errorStateMatcher]="matcher" maxlength="100" />
										<mat-error *ngIf="form.get('jobTitle')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>
								<ng-container *ngIf="orgData.notPssoOrPecrc">
									<div class="col-xl-6 col-lg-12 col-md-12 col-sm-12">
										<mat-form-field>
											<mat-label>Vulnerable Sector Category</mat-label>
											<input matInput formControlName="vulnerableSectorCategoryDesc" />
										</mat-form-field>
									</div>
								</ng-container>
								<ng-container *ngIf="facilityNameShow">
									<div class="col-xl-6 col-lg-12 col-md-12 col-sm-12">
										<mat-form-field>
											<mat-label>{{ companyFacilityLabel }}</mat-label>
											<input matInput formControlName="contractedCompanyName" />
											<mat-hint>{{ companyFacilityHint }}</mat-hint>
											<mat-error *ngIf="form.get('contractedCompanyName')?.hasError('required')"
												>This is required</mat-error
											>
										</mat-form-field>
									</div>
								</ng-container>
							</div>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [],
})
export class SaSecurityInformationComponent implements CrcFormStepComponent {
	facilityNameShow = false;
	facilityNameRequired = false;
	companyFacilityLabel = '';
	companyFacilityHint = '';

	private _orgData: AppInviteOrgData | null = null;
	@Input()
	set orgData(data: AppInviteOrgData | null) {
		if (!data) return;

		this._orgData = data;

		let companyFacilityLabel = '';
		let companyFacilityHint = '';

		if (data.screeningType) {
			if (data.isCrrpa) {
				// If coming from Portal Invitation (screeningType is provided). If shown, always required.
				this.facilityNameShow = [ScreeningTypeCode.Contractor, ScreeningTypeCode.Licensee].includes(
					data.screeningType!
				);
				this.facilityNameRequired = this.facilityNameShow;

				if (data.screeningType == ScreeningTypeCode.Contractor) {
					companyFacilityLabel = 'Contracted Company Name';
				} else if (data.screeningType == ScreeningTypeCode.Licensee) {
					companyFacilityLabel = 'Facility Name';
					companyFacilityHint = '(Licensed Child Care Name or Adult Care Facility Name)';
				}
			} else {
				this.facilityNameShow = false;
				this.facilityNameRequired = false;
			}
		} else {
			// If coming from Access Code page, use these flags to determine if field is shown. If shown, always optional
			this.facilityNameShow =
				data.contractorsNeedVulnerableSectorScreening == BooleanTypeCode.Yes ||
				data.licenseesNeedVulnerableSectorScreening == BooleanTypeCode.Yes
					? true
					: false;
			this.facilityNameRequired = false;

			companyFacilityLabel = 'Contracted Company / Facility Name';
		}

		this.companyFacilityLabel = companyFacilityLabel;
		this.companyFacilityHint = companyFacilityHint;

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
						(_form) => this.facilityNameRequired
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
