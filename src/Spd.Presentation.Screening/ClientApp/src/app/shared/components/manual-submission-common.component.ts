import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { NgxMaskPipe } from 'ngx-mask';
import { Observable } from 'rxjs';
import {
	ApplicationCreateResponse,
	BooleanTypeCode,
	MinistryResponse,
	ScreeningTypeCode,
	ServiceTypeCode,
} from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { ApplicationOriginTypeCode } from 'src/app/core/code-types/application-origin-type.model';
import {
	GenderTypes,
	PayerPreferenceTypes,
	ScreeningTypes,
	SelectOptions,
	ServiceTypes,
} from 'src/app/core/code-types/model-desc.models';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { AuthUserIdirService } from 'src/app/core/services/auth-user-idir.service';
import { OptionsService } from 'src/app/core/services/options.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { CrrpRoutes } from 'src/app/modules/crrp-portal/crrp-routing.module';
import { PssoRoutes } from 'src/app/modules/psso-portal/psso-routing.module';
import { Address, AddressAutocompleteComponent } from 'src/app/shared/components/address-autocomplete.component';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { FormatDatePipe } from '../pipes/format-date.pipe';

export interface AliasCreateRequest {
	givenName?: null | string;
	middleName1?: null | string;
	middleName2?: null | string;
	surname?: null | string;
}

export interface ManualSubmissionBody {
	ConsentFormFile: File | null;
	ApplicationCreateRequestJson: string;
}

@Component({
	selector: 'app-manual-submission-common',
	template: `
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row mb-2">
				<div class="col-xl-10 col-lg-10 col-md-12 col-sm-12">
					<h2>
						Manual Submissions
						<div class="mt-2 fs-5 fw-light">
							<ng-container *ngIf="portal === portalTypeCodes.Psso; else crrpSubtitle">
								Enter the applicant's information and submit their application
							</ng-container>
							<ng-template #crrpSubtitle>
								<div *ngIf="isNotVolunteerOrg; else isVolunteer">
									Enter the applicant's information, upload their consent form, and then pay the criminal record check
									fee
								</div>
								<ng-template #isVolunteer>
									Enter the applicant's information and then upload their consent form
								</ng-template>
							</ng-template>
						</div>
					</h2>
				</div>
			</div>

			<form [formGroup]="form" novalidate>
				<mat-divider class="mat-divider-main mb-3"></mat-divider>
				<section>
					<div class="text-minor-heading fw-semibold mb-2">Applicant Information</div>
					<mat-checkbox formControlName="oneLegalName" (click)="onOneLegalNameChange()">
						Applicant has only a given name OR a surname
					</mat-checkbox>
					<div class="row">
						<div class="col-xl-3 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label
									>Legal Given Name
									<span class="optional-label" *ngIf="isGivenNameOptional">(optional)</span></mat-label
								>
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
								<mat-error *ngIf="!isGivenNameOptional && form.get('surname')?.hasError('required')">
									This is required
								</mat-error>
								<mat-error *ngIf="isGivenNameOptional && form.get('surname')?.hasError('required')">
									Use this field if applicant has only one name
								</mat-error>
							</mat-form-field>
						</div>

						<div class="col-xl-3 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Email</mat-label>
								<input matInput formControlName="emailAddress" [errorStateMatcher]="matcher" maxlength="75" />
								<mat-error *ngIf="form.get('emailAddress')?.hasError('required')"> This is required </mat-error>
								<mat-error *ngIf="form.get('emailAddress')?.hasError('email')">
									Must be a valid email address
								</mat-error>
							</mat-form-field>
						</div>
						<div class="col-xl-3 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Phone Number</mat-label>
								<input
									matInput
									formControlName="phoneNumber"
									[mask]="phoneMask"
									[showMaskTyped]="false"
									[errorStateMatcher]="matcher"
								/>
								<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')"> This is required </mat-error>
								<mat-error *ngIf="form.get('phoneNumber')?.hasError('mask')">This must be 10 digits</mat-error>
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
								<mat-datepicker #picker startView="multi-year"></mat-datepicker>
								<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('dateOfBirth')?.hasError('matDatepickerMax')">
									This must be on or before {{ maxBirthDate | formatDate }}
								</mat-error>
							</mat-form-field>
						</div>
						<div class="col-xl-3 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Birthplace</mat-label>
								<input
									matInput
									formControlName="birthPlace"
									placeholder="City, Country"
									[errorStateMatcher]="matcher"
									maxlength="100"
								/>
								<mat-error *ngIf="form.get('birthPlace')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
						<div class="col-xl-3 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>BC Drivers Licence <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="driversLicense" mask="00000009" />
								<mat-error *ngIf="form.get('driversLicense')?.hasError('mask')"> This must be 7 or 8 digits </mat-error>
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
						<div class="col-xl-3 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Job Title</mat-label>
								<input matInput formControlName="jobTitle" [errorStateMatcher]="matcher" maxlength="100" />
								<mat-error *ngIf="form.get('jobTitle')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
						<div class="col-xl-3 col-lg-6 col-md-12" *ngIf="showScreeningType">
							<mat-form-field>
								<mat-label>Application Type</mat-label>
								<mat-select formControlName="screeningType">
									<mat-option *ngFor="let scr of screeningTypes" [value]="scr.code">
										{{ scr.desc }}
									</mat-option>
								</mat-select>
								<mat-error *ngIf="form.get('screeningType')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
						<div class="col-xl-3 col-lg-6 col-md-12" *ngIf="isDisplayFacilityName">
							<mat-form-field>
								<mat-label>Company / Facility Name</mat-label>
								<input matInput formControlName="contractedCompanyName" [errorStateMatcher]="matcher" maxlength="100" />
								<mat-error *ngIf="form.get('contractedCompanyName')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
						<div class="col-xl-3 col-lg-6 col-md-12" *ngIf="portal === portalTypeCodes.Psso">
							<mat-form-field>
								<mat-label>Employee ID <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="employeeId" mask="000000" />
								<mat-error *ngIf="form.get('employeeId')?.hasError('mask')"> This must be 6 digits </mat-error>
							</mat-form-field>
						</div>
						<div class="col-xl-6 col-lg-12 col-md-12" *ngIf="showMinistries">
							<mat-form-field>
								<mat-label>Ministry</mat-label>
								<mat-select formControlName="orgId" (selectionChange)="onChangeMinistry($event)">
									<mat-option *ngFor="let ministry of ministries" [value]="ministry.id">
										{{ ministry.name }}
									</mat-option>
								</mat-select>
								<mat-error *ngIf="form.get('orgId')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
						<div class="col-xl-3 col-lg-6 col-md-12" *ngIf="showServiceType">
							<mat-form-field>
								<mat-label>Service Type</mat-label>
								<mat-select
									formControlName="serviceType"
									(selectionChange)="onChangeServiceType($event)"
									[errorStateMatcher]="matcher"
								>
									<mat-option *ngFor="let srv of serviceTypes" [value]="srv.code">
										{{ srv.desc }}
									</mat-option>
								</mat-select>
								<mat-error *ngIf="form.get('serviceType')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>

						<div class="col-xl-3 col-lg-6 col-md-12" *ngIf="showPaidBy">
							<mat-form-field>
								<mat-label>Paid by</mat-label>
								<mat-select formControlName="payeeType" [errorStateMatcher]="matcher">
									<mat-option *ngFor="let payer of payerPreferenceTypes" [value]="payer.code">
										{{ payer.desc }}
									</mat-option>
								</mat-select>
								<mat-error *ngIf="form.get('payeeType')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
					</div>
					<ng-container *ngIf="serviceTypeIsMcfd">
						<app-alert type="warning">{{ mcfdWarning }}</app-alert>
					</ng-container>
				</section>

				<mat-divider class="my-3"></mat-divider>
				<section>
					<div class="text-minor-heading fw-semibold mb-2">Does the applicant have a previous name?</div>
					<div class="row">
						<div class="col-xl-4 col-lg-12">
							<mat-radio-group aria-label="Select an option" formControlName="previousNameFlag" class="d-flex flex-row">
								<mat-radio-button class="me-4" style="width: initial;" [value]="booleanTypeCodes.No"
									>No</mat-radio-button
								>
								<mat-radio-button [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('previousNameFlag')?.dirty || form.get('previousNameFlag')?.touched) &&
									form.get('previousNameFlag')?.invalid &&
									form.get('previousNameFlag')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>

					<div *ngIf="previousNameFlag.value === booleanTypeCodes.Yes">
						<div class="text-minor-heading fw-semibold mb-2">Previous Names</div>
						<ng-container formArrayName="aliases" *ngFor="let group of getFormControls.controls; let i = index">
							<div class="row" [formGroupName]="i">
								<div class="col-xl-3 col-lg-3 col-md-6 col-sm-12">
									<mat-form-field>
										<mat-label>Given Name <span class="optional-label">(optional)</span></mat-label>
										<input matInput type="text" formControlName="givenName" maxlength="40" />
									</mat-form-field>
								</div>
								<div class="col-xl-3 col-lg-3 col-md-6 col-sm-12">
									<mat-form-field>
										<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
										<input matInput type="text" formControlName="middleName1" maxlength="40" />
									</mat-form-field>
								</div>
								<div class="col-xl-2 col-lg-2 col-md-6 col-sm-12">
									<mat-form-field>
										<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
										<input matInput type="text" formControlName="middleName2" maxlength="40" />
									</mat-form-field>
								</div>
								<div class="col-xl-3 col-lg-3 col-md-6 col-sm-12">
									<mat-form-field>
										<mat-label>Surname</mat-label>
										<input
											matInput
											type="text"
											formControlName="surname"
											required
											[errorStateMatcher]="matcher"
											maxlength="40"
										/>
										<mat-error *ngIf="group.get('surname')?.hasError('required')"> This is required </mat-error>
									</mat-form-field>
								</div>
								<div class="col-xl-1 col-lg-1 col-md-6 col-sm-12">
									<button
										mat-mini-fab
										class="delete-row-button mb-3"
										matTooltip="Remove previous name"
										(click)="onDeleteRow(i)"
										*ngIf="moreThanOneRowExists"
										aria-label="Remove row"
									>
										<mat-icon>delete_outline</mat-icon>
									</button>
								</div>
							</div>
						</ng-container>
						<div class="row" *ngIf="isAllowAliasAdd">
							<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
								<button mat-stroked-button (click)="onAddRow()">
									<mat-icon class="add-icon">add_circle</mat-icon>Add Another Name
								</button>
							</div>
						</div>
					</div>
				</section>

				<mat-divider class="my-3"></mat-divider>
				<section>
					<div class="text-minor-heading fw-semibold mb-2">Mailing Address</div>
					<div class="row mt-3">
						<div class="col-lg-8 col-md-12 col-sm-12">
							<app-address-form-autocomplete
								(autocompleteAddress)="onAddressAutocomplete($event)"
								(enterAddressManually)="onEnterAddressManually()"
							>
							</app-address-form-autocomplete>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('addressSelected')?.dirty || form.get('addressSelected')?.touched) &&
									form.get('addressSelected')?.invalid &&
									form.get('addressSelected')?.hasError('required')
								"
							>
								This is required
							</mat-error>
						</div>
					</div>

					<ng-container *ngIf="form.get('addressSelected')?.value">
						<div class="row">
							<div class="col-lg-8 col-md-12 col-sm-12">
								<div class="text-minor-heading fw-semibold mb-2">Address Information</div>
								<mat-form-field>
									<mat-label>Street Address 1</mat-label>
									<input matInput formControlName="addressLine1" maxlength="100" />
									<mat-error *ngIf="form.get('addressLine1')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
						</div>
						<div class="row">
							<div class="col-lg-8 col-md-12 col-sm-12">
								<mat-form-field>
									<mat-label>Street Address 2 <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="addressLine2" maxlength="100" />
								</mat-form-field>
							</div>
						</div>
						<div class="row">
							<div class="col-lg-4 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>City</mat-label>
									<input matInput formControlName="city" maxlength="100" />
									<mat-error *ngIf="form.get('city')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-lg-4 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Postal/Zip Code</mat-label>
									<input
										matInput
										formControlName="postalCode"
										oninput="this.value = this.value.toUpperCase()"
										maxlength="20"
									/>
									<mat-error *ngIf="form.get('postalCode')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
						</div>
						<div class="row">
							<div class="col-lg-4 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Province/State</mat-label>
									<input matInput formControlName="province" maxlength="100" />
									<mat-error *ngIf="form.get('province')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-lg-4 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Country</mat-label>
									<input matInput formControlName="country" maxlength="100" />
									<mat-error *ngIf="form.get('country')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
						</div>
					</ng-container>
				</section>

				<mat-divider class="my-3"></mat-divider>
				<section>
					<div class="text-minor-heading fw-semibold mb-2">Declaration</div>
					<div class="row">
						<div class="col-md-12 col-sm-12">
							<mat-checkbox formControlName="agreeToCompleteAndAccurate">
								I certify that, to the best of my knowledge, the information I have provided and will provide as
								necessary is complete and accurate
							</mat-checkbox>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('agreeToCompleteAndAccurate')?.dirty || form.get('agreeToCompleteAndAccurate')?.touched) &&
									form.get('agreeToCompleteAndAccurate')?.invalid &&
									form.get('agreeToCompleteAndAccurate')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
						<div class="col-md-12 col-sm-12">
							<mat-checkbox formControlName="haveVerifiedIdentity">
								<ng-container *ngIf="portal === portalTypeCodes.Psso; else haveVerifiedIdentityCrrpLabel">
									I have verified the identity of the applicant for this criminal record check
								</ng-container>
								<ng-template #haveVerifiedIdentityCrrpLabel>
									I confirm that I have verified the identity of the applicant for this criminal record check
								</ng-template>
								<span class="optional-label">(optional)</span>
							</mat-checkbox>
						</div>
					</div>

					<ng-container *ngIf="portal === portalTypeCodes.Crrp">
						<mat-divider class="my-3"></mat-divider>
						<div class="text-minor-heading fw-semibold mb-2">
							Upload the copy of signed consent form sent by the applicant
						</div>
						<div class="my-4">
							<app-file-upload [maxNumberOfFiles]="1"></app-file-upload>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
									form.get('attachments')?.invalid &&
									form.get('attachments')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</ng-container>
				</section>
			</form>
			<div class="row">
				<div class="offset-xl-8 offset-lg-6 col-xl-2 col-lg-3 col-md-6 col-sm-12">
					<button mat-stroked-button color="primary" class="large mb-2" (click)="onCancel()">
						<i class="fa fa-times mr-2"></i>Cancel
					</button>
				</div>
				<div class="col-xl-2 col-lg-3 col-md-6 col-sm-12">
					<button mat-flat-button color="primary" class="large mb-2" (click)="onSubmit()">Submit</button>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.text-minor-heading {
				color: var(--color-primary-light);
			}
		`,
	],
})
export class ManualSubmissionCommonComponent implements OnInit {
	mcfdWarning = SPD_CONSTANTS.message.mcfdWarning;

	ministries: Array<MinistryResponse> = [];
	isNotVolunteerOrg = false;

	@ViewChild(AddressAutocompleteComponent) addressAutocompleteComponent!: AddressAutocompleteComponent;
	matcher = new FormErrorStateMatcher();

	isGivenNameOptional = false;

	showScreeningType = false;
	screeningTypes = ScreeningTypes;
	screeningTypeCodes = ScreeningTypeCode;
	payerPreferenceTypes = PayerPreferenceTypes;

	showServiceType = false;
	showPaidBy = false;
	serviceTypeDefault: ServiceTypeCode | null = null;
	serviceTypes: null | SelectOptions[] = [];

	genderTypes = GenderTypes;
	portalTypeCodes = PortalTypeCode;

	phoneMask = SPD_CONSTANTS.phone.displayMask;
	booleanTypeCodes = BooleanTypeCode;
	form: FormGroup = this.formBuilder.group(
		{
			givenName: new FormControl('', [FormControlValidators.required]),
			middleName1: new FormControl(''),
			middleName2: new FormControl(''),
			surname: new FormControl('', [FormControlValidators.required]),
			oneLegalName: new FormControl(false),
			emailAddress: new FormControl('', [FormControlValidators.email]),
			phoneNumber: new FormControl('', [Validators.required]),
			driversLicense: new FormControl(''),
			genderCode: new FormControl(''),
			dateOfBirth: new FormControl(null, [Validators.required]),
			birthPlace: new FormControl('', [FormControlValidators.required]),
			jobTitle: new FormControl('', [FormControlValidators.required]),
			screeningType: new FormControl(''),
			serviceType: new FormControl(this.serviceTypeDefault),
			payeeType: new FormControl(''),
			contractedCompanyName: new FormControl(''),
			employeeId: new FormControl(''),
			orgId: new FormControl(null),
			previousNameFlag: new FormControl('', [FormControlValidators.required]),
			addressSelected: new FormControl(false, [Validators.requiredTrue]),
			addressLine1: new FormControl('', [FormControlValidators.required]),
			addressLine2: new FormControl(''),
			city: new FormControl('', [FormControlValidators.required]),
			postalCode: new FormControl('', [FormControlValidators.required]),
			province: new FormControl('', [FormControlValidators.required]),
			country: new FormControl('', [FormControlValidators.required]),
			agreeToCompleteAndAccurate: new FormControl('', [Validators.requiredTrue]),
			haveVerifiedIdentity: new FormControl(''),
			aliases: this.formBuilder.array([]),
			attachments: new FormControl('', [Validators.required]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('screeningType', (_form) => this.showScreeningType ?? false),
				FormGroupValidators.conditionalRequiredValidator('serviceType', (_form) => this.showServiceType ?? false),
				FormGroupValidators.conditionalRequiredValidator('payeeType', (_form) =>
					this.isPeCrc(_form.get('serviceType')?.value ?? false)
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'emailAddress',
					(_form) => this.portal == PortalTypeCode.Crrp
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(_form) => this.portal == PortalTypeCode.Crrp
				),
				FormGroupValidators.conditionalRequiredValidator(
					'givenName',
					(form) => form.get('oneLegalName')?.value != true
				),
				FormGroupValidators.conditionalRequiredValidator('orgId', (_form) => this.showMinistries),
				FormGroupValidators.conditionalRequiredValidator('contractedCompanyName', (form) =>
					[ScreeningTypeCode.Contractor, ScreeningTypeCode.Licensee].includes(form.get('screeningType')?.value)
				),
			],
		}
	);
	maxBirthDate = this.utilService.getBirthDateMax();

	// org id - for PSSO this is the ministry OrgId, otherwise the CRRP org
	@Input() orgId: string | null = null;
	@Input() portal: PortalTypeCode | null = null;
	@Input() isPsaUser: boolean | undefined = undefined;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private router: Router,
		private formBuilder: FormBuilder,
		private applicationService: ApplicationService,
		private authUserBceidService: AuthUserBceidService,
		private authUserIdirService: AuthUserIdirService,
		private optionsService: OptionsService,
		private utilService: UtilService,
		private hotToast: HotToastService,
		private maskPipe: NgxMaskPipe,
		private formatDatePipe: FormatDatePipe,
		private dialog: MatDialog
	) {}

	ngOnInit(): void {
		if (!this.orgId) {
			console.debug('ManualSubmissionCommonComponent - missing orgId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		if (this.portal == PortalTypeCode.Crrp) {
			// using bceid
			const orgProfile = this.authUserBceidService.bceidUserOrgProfile!;
			this.isNotVolunteerOrg = orgProfile?.isNotVolunteerOrg ?? false;

			if (this.isNotVolunteerOrg) {
				const licenseesNeedVulnerableSectorScreening =
					orgProfile.licenseesNeedVulnerableSectorScreening === BooleanTypeCode.Yes;
				const contractorsNeedVulnerableSectorScreening =
					orgProfile.contractorsNeedVulnerableSectorScreening === BooleanTypeCode.Yes;

				this.showScreeningType = this.utilService.getShowScreeningType(
					licenseesNeedVulnerableSectorScreening,
					contractorsNeedVulnerableSectorScreening
				);
				this.screeningTypes = this.utilService.getScreeningTypes(
					licenseesNeedVulnerableSectorScreening,
					contractorsNeedVulnerableSectorScreening
				);
			} else {
				this.showScreeningType = false;
			}

			this.showServiceType = false;
			this.serviceTypeDefault = orgProfile?.serviceTypes ? orgProfile?.serviceTypes[0] : null;
		} else {
			// using idir
			this.isNotVolunteerOrg = true;
			this.showScreeningType = false;
			this.showServiceType = true;
			this.serviceTypeDefault = this.isPsaUser ? null : ServiceTypeCode.Psso;

			// get the service types to show based upon the user's ministry
			const userProfile = this.authUserIdirService.idirUserWhoamiProfile;
			this.populateServiceTypes(userProfile?.orgId);
		}

		this.resetForm();
	}

	onChangeMinistry(event: MatSelectChange): void {
		this.populateServiceTypes(event.value);
	}

	onChangeServiceType(event: MatSelectChange): void {
		this.showPaidBy = this.isPeCrc(event.value);
	}

	onCancel(): void {
		this.resetForm();
	}

	onSubmit() {
		if (this.portal == PortalTypeCode.Crrp) {
			const attachments =
				this.fileUploadComponent.files && this.fileUploadComponent.files.length > 0
					? this.fileUploadComponent.files[0]
					: '';
			this.form.controls['attachments'].setValue(attachments);
		}

		this.form.markAllAsTouched();

		if (this.previousNameFlag.value != BooleanTypeCode.Yes) {
			this.aliases.clear();
		}

		if (!this.form.valid) {
			this.utilService.scrollToErrorSection();
		}

		if (this.form.valid) {
			const createRequest: any = { ...this.form.value } as Parameters<
				ApplicationService['apiOrgsOrgIdApplicationPost']
			>[0]['body']['ApplicationCreateRequestJson'];

			createRequest.originTypeCode = ApplicationOriginTypeCode.OrganizationSubmitted;
			createRequest.phoneNumber = createRequest.phoneNumber
				? this.maskPipe.transform(createRequest.phoneNumber, SPD_CONSTANTS.phone.backendMask)
				: '';
			createRequest.dateOfBirth = this.formatDatePipe.transform(
				createRequest.dateOfBirth,
				SPD_CONSTANTS.date.backendDateFormat
			);
			createRequest.haveVerifiedIdentity = createRequest.haveVerifiedIdentity == true;
			createRequest.contractedCompanyName = [ScreeningTypeCode.Contractor, ScreeningTypeCode.Licensee].includes(
				createRequest.screeningType
			)
				? createRequest.contractedCompanyName
				: '';

			if (!this.showScreeningType) {
				createRequest.screeningType = ScreeningTypeCode.Staff;
			}

			createRequest.requireDuplicateCheck = true;

			const body: ManualSubmissionBody = {
				ConsentFormFile: this.portal == PortalTypeCode.Crrp ? this.fileUploadComponent.files[0] : null,
				ApplicationCreateRequestJson: JSON.stringify(createRequest),
			};

			if (
				this.portal == PortalTypeCode.Psso &&
				createRequest.serviceType != ServiceTypeCode.PssoVs &&
				createRequest.serviceType != ServiceTypeCode.PeCrcVs
			) {
				this.saveAndCheckDuplicates(body);
			} else {
				this.promptVulnerableSector(body);
			}
		}
	}

	onOneLegalNameChange(): void {
		this.isGivenNameOptional = this.oneLegalName.value;
	}

	onAddressAutocomplete(address: Address): void {
		if (!address) {
			this.form.patchValue({
				addressSelected: false,
				addressLine1: '',
				addressLine2: '',
				city: '',
				postalCode: '',
				province: '',
				country: '',
			});
			return;
		}

		const { countryCode, provinceCode, postalCode, line1, line2, city } = address;
		this.form.patchValue({
			addressSelected: true,
			addressLine1: line1,
			addressLine2: line2,
			city: city,
			postalCode: postalCode,
			province: provinceCode,
			country: countryCode,
		});
	}

	onEnterAddressManually(): void {
		this.form.patchValue({
			addressSelected: true,
		});
	}

	onAddRow() {
		const control = this.form.get('aliases') as FormArray;
		control.push(this.newAliasRow());
	}

	onDeleteRow(index: number) {
		const control = this.form.get('aliases') as FormArray;
		if (control.length == 1) {
			const data: DialogOptions = {
				icon: 'warning',
				title: 'Remove row',
				message: 'This row cannot be removed. At least one row must exist.',
				cancelText: 'Close',
			};

			this.dialog.open(DialogComponent, { data });
			return;
		}

		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this previous name?',
			actionText: 'Yes, remove name',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					const control = this.form.get('aliases') as FormArray;
					control.removeAt(index);
				}
			});
	}

	get getFormControls() {
		const control = this.form.get('aliases') as FormArray;
		return control;
	}

	get aliases(): FormArray {
		return this.form.get('aliases') as FormArray;
	}

	get previousNameFlag(): FormControl {
		return this.form.get('previousNameFlag') as FormControl;
	}

	get screeningType(): FormControl {
		return this.form.get('screeningType') as FormControl;
	}

	get moreThanOneRowExists(): boolean {
		return this.aliases.length > 1;
	}

	get isAllowAliasAdd(): boolean {
		return this.aliases.length < SPD_CONSTANTS.maxNumberOfAliases;
	}

	get isDisplayFacilityName(): boolean {
		return [ScreeningTypeCode.Contractor, ScreeningTypeCode.Licensee].includes(this.screeningType.value);
	}

	private isPeCrc(serviceTypeCode: ServiceTypeCode): boolean {
		return serviceTypeCode === ServiceTypeCode.PeCrc || serviceTypeCode === ServiceTypeCode.PeCrcVs;
	}

	private populateServiceTypes(orgId: string | null | undefined) {
		if (!orgId) {
			this.serviceTypes = [];
		}

		this.ministries = this.optionsService.getMinistries();

		const currentMinistry = this.ministries.find((item: MinistryResponse) => item.id === orgId);
		const serviceTypes =
			currentMinistry?.serviceTypeCodes?.map(
				(item: ServiceTypeCode) => ServiceTypes.find((option: SelectOptions) => option.code === item)!
			) ?? [];
		serviceTypes.sort((a: SelectOptions, b: SelectOptions) =>
			this.utilService.compareByStringUpper(a.desc ?? '', b.desc)
		);
		this.serviceTypes = serviceTypes;

		// if there is only one value, use it and do not show the dropdown
		let defaultServiceTypeCode: string | null = null;
		if (serviceTypes.length === 1) {
			defaultServiceTypeCode = (serviceTypes[0].code as string) ?? null;
			this.showServiceType = false;
		} else {
			this.showServiceType = true;
		}

		this.form.patchValue({ serviceType: defaultServiceTypeCode }, { emitEvent: false });
	}

	private resetForm(): void {
		this.form.reset();
		this.aliases.clear();
		this.onAddRow();

		this.form.patchValue({ orgId: this.orgId, serviceType: this.serviceTypeDefault });
	}

	private newAliasRow(): FormGroup {
		return this.formBuilder.group({
			givenName: [''],
			middleName1: [''],
			middleName2: [''],
			surname: ['', [FormControlValidators.required]],
		});
	}

	private displayDataValidationMessage(body: ManualSubmissionBody, dupres: ApplicationCreateResponse): void {
		if (dupres.createSuccess) {
			this.handleSaveSuccess();
			return;
		}

		if (dupres.hasPotentialDuplicate) {
			const data: DialogOptions = {
				icon: 'warning',
				title: 'Potential duplicate detected',
				message:
					'An in-progress application already exists for this applicant, with your organization for this screening type. How would you like to proceed?',
				actionText: 'Submit Application',
				cancelText: 'Cancel',
			};
			this.dialog
				.open(DialogComponent, { data })
				.afterClosed()
				.subscribe((response: boolean) => {
					if (response) {
						this.saveManualSubmission(body);
					}
				});
		} else {
			this.saveManualSubmission(body);
		}
	}

	private saveAndCheckDuplicates(body: ManualSubmissionBody): void {
		// Check for potential duplicate
		this.saveBody(body, true)
			.pipe()
			.subscribe((dupres: ApplicationCreateResponse) => {
				this.displayDataValidationMessage(body, dupres);
			});
	}

	private saveManualSubmission(body: ManualSubmissionBody): void {
		this.saveBody(body, false)
			.pipe()
			.subscribe((_resp: any) => {
				this.handleSaveSuccess();
			});
	}

	private saveBody(body: ManualSubmissionBody, requireDuplicateCheck: boolean): Observable<ApplicationCreateResponse> {
		const applicationCreateRequestJson = JSON.parse(body.ApplicationCreateRequestJson);
		applicationCreateRequestJson.requireDuplicateCheck = requireDuplicateCheck; // Check for potential duplicate

		const consentFormFile = body.ConsentFormFile ? (body.ConsentFormFile as Blob) : undefined;

		return this.applicationService.apiOrgsOrgIdApplicationPost({
			orgId: this.orgId!,
			body: {
				ConsentFormFile: consentFormFile,
				ApplicationCreateRequestJson: JSON.stringify(applicationCreateRequestJson) as any,
			},
		});
	}

	private promptVulnerableSector(body: ManualSubmissionBody): void {
		const data: DialogOptions = {
			icon: 'info_outline',
			title: 'Vulnerable sector',
			message: '',
			actionText: 'Yes',
			cancelText: 'No',
		};

		data.message =
			'In their role with your organization, will this person work directly with, or potentially have unsupervised access to, children and/or vulnerable adults?';

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.saveAndCheckDuplicates(body);
				} else {
					this.promptVulnerableSectorNo(body);
				}
			});
	}

	private promptVulnerableSectorNo(body: ManualSubmissionBody): void {
		const data: DialogOptions = {
			icon: 'info_outline',
			title: 'Criminal record check',
			message: '',
			actionText: 'Cancel request',
			cancelText: 'Previous',
		};

		data.message = `If the applicant will not have unsupervised access to children or vulnerable adults in this role, but they require a criminal record check for another reason, please <a href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check" target="_blank"> contact your local police detachment</a>`;

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (!response) {
					this.promptVulnerableSector(body);
				}
			});
	}

	private handleSaveSuccess(): void {
		this.hotToast.success('Your screening request has been sent to the applicant');
		if (this.portal == PortalTypeCode.Crrp) {
			this.router.navigateByUrl(CrrpRoutes.path(CrrpRoutes.APPLICATION_STATUSES));
		} else if (this.portal == PortalTypeCode.Psso) {
			this.router.navigateByUrl(PssoRoutes.path(PssoRoutes.SCREENING_STATUSES));
		}
	}

	get showMinistries(): boolean {
		return this.portal === PortalTypeCode.Psso && this.isPsaUser === true;
	}
	get oneLegalName(): FormControl {
		return this.form.get('oneLegalName') as FormControl;
	}
	get serviceTypeIsMcfd(): boolean {
		return this.form.get('serviceType')?.value === ServiceTypeCode.Mcfd;
	}
}
