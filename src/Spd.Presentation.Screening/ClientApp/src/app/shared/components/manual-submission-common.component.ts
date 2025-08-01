import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
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
import { AppRoutes } from 'src/app/app-routes';
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
import { CrrpRoutes } from 'src/app/modules/crrp-portal/crrp-routes';
import { PssoRoutes } from 'src/app/modules/psso-portal/psso-routes';
import { Address, AddressAutocompleteComponent } from 'src/app/shared/components/address-autocomplete.component';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
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
							@if (portal === portalTypeCodes.Psso) {
								Enter the applicant's information and submit their application
							} @else {
								@if (isNotVolunteerOrg) {
									<div>
										Enter the applicant's information, upload their consent form, and then pay the criminal record check
										fee
									</div>
								} @else {
									Enter the applicant's information and then upload their consent form
								}
							}
						</div>
					</h2>
				</div>
			</div>

			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-10 col-xl-12 col-lg-12">
						<mat-divider class="mat-divider-main mb-3"></mat-divider>
						<section>
							<div class="text-minor-heading fw-semibold mb-2">Applicant Information</div>
							<mat-checkbox formControlName="oneLegalName" (click)="onOneLegalNameChange()">
								Applicant has only a given name OR a surname
							</mat-checkbox>
							<div class="row">
								<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label
											>Legal Given Name
											@if (isGivenNameOptional) {
												<span class="optional-label">(optional)</span>
											}
										</mat-label>
										<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
										@if (form.get('givenName')?.hasError('required')) {
											<mat-error> This is required </mat-error>
										}
									</mat-form-field>
								</div>
								<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
										<input matInput formControlName="middleName1" maxlength="40" />
									</mat-form-field>
								</div>
								<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
										<input matInput formControlName="middleName2" maxlength="40" />
									</mat-form-field>
								</div>
								<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Legal Surname</mat-label>
										<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
										@if (!isGivenNameOptional && form.get('surname')?.hasError('required')) {
											<mat-error> This is required </mat-error>
										}
										@if (isGivenNameOptional && form.get('surname')?.hasError('required')) {
											<mat-error> Use this field if applicant has only one name </mat-error>
										}
									</mat-form-field>
								</div>

								<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Email</mat-label>
										<input matInput formControlName="emailAddress" [errorStateMatcher]="matcher" maxlength="75" />
										@if (form.get('emailAddress')?.hasError('required')) {
											<mat-error> This is required </mat-error>
										}
										@if (form.get('emailAddress')?.hasError('email')) {
											<mat-error> Must be a valid email address </mat-error>
										}
									</mat-form-field>
								</div>
								<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Phone Number</mat-label>
										<input
											matInput
											formControlName="phoneNumber"
											[mask]="phoneMask"
											[showMaskTyped]="false"
											[errorStateMatcher]="matcher"
										/>
										@if (form.get('phoneNumber')?.hasError('required')) {
											<mat-error> This is required </mat-error>
										}
										@if (form.get('phoneNumber')?.hasError('mask')) {
											<mat-error>This must be 10 digits</mat-error>
										}
									</mat-form-field>
								</div>
								<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
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
										@if (form.get('dateOfBirth')?.hasError('matDatepickerMax')) {
											<mat-error> This must be on or before {{ maxBirthDate | formatDate }} </mat-error>
										}
										@if (form.get('dateOfBirth')?.hasError('matDatepickerMin')) {
											<mat-error> Invalid date of birth </mat-error>
										}
									</mat-form-field>
								</div>
								<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Birthplace</mat-label>
										<input
											matInput
											formControlName="birthPlace"
											placeholder="City, Country"
											[errorStateMatcher]="matcher"
											maxlength="100"
										/>
										@if (form.get('birthPlace')?.hasError('required')) {
											<mat-error> This is required </mat-error>
										}
									</mat-form-field>
								</div>
								<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>BC Drivers Licence <span class="optional-label">(optional)</span></mat-label>
										<input matInput formControlName="driversLicense" mask="00000009" />
										@if (form.get('driversLicense')?.hasError('mask')) {
											<mat-error> This must be 7 or 8 digits </mat-error>
										}
									</mat-form-field>
								</div>
								<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Sex</mat-label>
										<mat-select formControlName="genderCode">
											@for (gdr of genderTypes; track gdr) {
												<mat-option [value]="gdr.code">
													{{ gdr.desc }}
												</mat-option>
											}
										</mat-select>
										@if (form.get('genderCode')?.hasError('required')) {
											<mat-error> This is required </mat-error>
										}
									</mat-form-field>
								</div>
								<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Job Title</mat-label>
										<input matInput formControlName="jobTitle" [errorStateMatcher]="matcher" maxlength="100" />
										@if (form.get('jobTitle')?.hasError('required')) {
											<mat-error>This is required</mat-error>
										}
									</mat-form-field>
								</div>
								@if (showScreeningType) {
									<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Application Type</mat-label>
											<mat-select formControlName="screeningType">
												@for (scr of screeningTypes; track scr) {
													<mat-option [value]="scr.code">
														{{ scr.desc }}
													</mat-option>
												}
											</mat-select>
											@if (form.get('screeningType')?.hasError('required')) {
												<mat-error>This is required</mat-error>
											}
										</mat-form-field>
									</div>
								}
								@if (isDisplayFacilityName) {
									<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Company / Facility Name</mat-label>
											<input
												matInput
												formControlName="contractedCompanyName"
												[errorStateMatcher]="matcher"
												maxlength="100"
											/>
											@if (form.get('contractedCompanyName')?.hasError('required')) {
												<mat-error>This is required</mat-error>
											}
										</mat-form-field>
									</div>
								}
								@if (portal === portalTypeCodes.Psso) {
									<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Employee ID <span class="optional-label">(optional)</span></mat-label>
											<input matInput formControlName="employeeId" mask="000000" />
											@if (form.get('employeeId')?.hasError('mask')) {
												<mat-error> This must be 6 digits </mat-error>
											}
										</mat-form-field>
									</div>
								}
								@if (showMinistries) {
									<div class="col-xl-6 col-lg-12 col-md-12">
										<mat-form-field>
											<mat-label>Ministry</mat-label>
											<mat-select formControlName="orgId" (selectionChange)="onChangeMinistry($event)">
												@for (ministry of ministries; track ministry) {
													<mat-option [value]="ministry.id">
														{{ ministry.name }}
													</mat-option>
												}
											</mat-select>
											@if (form.get('orgId')?.hasError('required')) {
												<mat-error>This is required</mat-error>
											}
										</mat-form-field>
									</div>
								}
								@if (showServiceType) {
									<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Service Type</mat-label>
											<mat-select
												formControlName="serviceType"
												(selectionChange)="onChangeServiceType($event)"
												[errorStateMatcher]="matcher"
											>
												@for (srv of serviceTypes; track srv) {
													<mat-option [value]="srv.code">
														{{ srv.desc }}
													</mat-option>
												}
											</mat-select>
											@if (form.get('serviceType')?.hasError('required')) {
												<mat-error>This is required</mat-error>
											}
										</mat-form-field>
									</div>
								}

								@if (showPaidBy) {
									<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Paid by</mat-label>
											<mat-select formControlName="payeeType" [errorStateMatcher]="matcher">
												@for (payer of payerPreferenceTypes; track payer) {
													<mat-option [value]="payer.code">
														{{ payer.desc }}
													</mat-option>
												}
											</mat-select>
											@if (form.get('payeeType')?.hasError('required')) {
												<mat-error>This is required</mat-error>
											}
										</mat-form-field>
									</div>
								}
							</div>
							@if (serviceTypeIsPssoVs) {
								<div class="row my-2">
									<div class="col-xxl-8 col-xl-10 col-lg-12">
										<app-alert type="warning">{{ pssoVsWarning }}</app-alert>
									</div>
								</div>
							}
							@if (serviceTypeIsPssoPeCrc) {
								<div class="row my-2">
									<div class="col-xxl-8 col-xl-10 col-lg-12">
										<app-alert type="warning">
											<div [innerHtml]="pssoPeCrcWarning"></div>
										</app-alert>
									</div>
								</div>
							}
							@if (serviceTypeIsPssoPeCrcVs) {
								<div class="row my-2">
									<div class="col-xxl-8 col-xl-10 col-lg-12">
										<app-alert type="warning">
											<div [innerHtml]="pssoPeCrcVsWarning"></div>
										</app-alert>
									</div>
								</div>
							}
						</section>

						<mat-divider class="my-3"></mat-divider>
						<section>
							<div class="text-minor-heading fw-semibold mb-2">Does the applicant have a previous name?</div>
							<div class="row">
								<div class="col-xxl-3 col-xl-4 col-lg-12">
									<mat-radio-group
										aria-label="Select an option"
										formControlName="previousNameFlag"
										class="d-flex flex-row"
									>
										<mat-radio-button class="me-4" style="width: initial;" [value]="booleanTypeCodes.No"
											>No</mat-radio-button
										>
										<mat-radio-button [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
									</mat-radio-group>
									@if (
										(form.get('previousNameFlag')?.dirty || form.get('previousNameFlag')?.touched) &&
										form.get('previousNameFlag')?.invalid &&
										form.get('previousNameFlag')?.hasError('required')
									) {
										<mat-error class="mat-option-error">This is required</mat-error>
									}
								</div>
							</div>

							@if (previousNameFlag.value === booleanTypeCodes.Yes) {
								<div>
									<div class="text-minor-heading fw-semibold mb-2">Previous Names</div>
									@for (group of getFormControls.controls; track group; let i = $index) {
										<ng-container formArrayName="aliases">
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
														@if (group.get('surname')?.hasError('required')) {
															<mat-error> This is required </mat-error>
														}
													</mat-form-field>
												</div>
												<div class="col-xl-1 col-lg-1 col-md-6 col-sm-12">
													@if (moreThanOneRowExists) {
														<button
															mat-mini-fab
															class="delete-row-button mb-3"
															matTooltip="Remove previous name"
															(click)="onDeleteRow(i)"
															aria-label="Remove row"
														>
															<mat-icon>delete_outline</mat-icon>
														</button>
													}
												</div>
											</div>
										</ng-container>
									}
									@if (isAllowAliasAdd) {
										<div class="row">
											<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
												<button mat-stroked-button (click)="onAddRow()">
													<mat-icon class="add-icon">add_circle</mat-icon>Add Another Name
												</button>
											</div>
										</div>
									}
								</div>
							}
						</section>

						<mat-divider class="my-3"></mat-divider>
						<section>
							<div class="text-minor-heading fw-semibold mb-2">Mailing Address</div>
							<div class="row mt-3">
								<div class="col-xxl-8 col-xl-10 col-lg-12">
									<app-address-form-autocomplete
										(autocompleteAddress)="onAddressAutocomplete($event)"
										(enterAddressManually)="onEnterAddressManually()"
									>
									</app-address-form-autocomplete>
									@if (
										(form.get('addressSelected')?.dirty || form.get('addressSelected')?.touched) &&
										form.get('addressSelected')?.invalid &&
										form.get('addressSelected')?.hasError('required')
									) {
										<mat-error class="mat-option-error"> This is required </mat-error>
									}

									@if (form.get('addressSelected')?.value) {
										<div class="row">
											<div class="col-12">
												<div class="text-minor-heading fw-semibold mb-2">Address Information</div>
												<mat-form-field>
													<mat-label>Street Address 1</mat-label>
													<input matInput formControlName="addressLine1" maxlength="100" />
													@if (form.get('addressLine1')?.hasError('required')) {
														<mat-error>This is required</mat-error>
													}
												</mat-form-field>
											</div>
										</div>
										<div class="row">
											<div class="col-12">
												<mat-form-field>
													<mat-label>Street Address 2 <span class="optional-label">(optional)</span></mat-label>
													<input matInput formControlName="addressLine2" maxlength="100" />
												</mat-form-field>
											</div>
										</div>
										<div class="row">
											<div class="col-md-6 col-sm-12">
												<mat-form-field>
													<mat-label>City</mat-label>
													<input matInput formControlName="city" maxlength="100" />
													@if (form.get('city')?.hasError('required')) {
														<mat-error>This is required</mat-error>
													}
												</mat-form-field>
											</div>
											<div class="col-md-6 col-sm-12">
												<mat-form-field>
													<mat-label>Postal/Zip Code</mat-label>
													<input
														matInput
														formControlName="postalCode"
														oninput="this.value = this.value.toUpperCase()"
														maxlength="20"
													/>
													@if (form.get('postalCode')?.hasError('required')) {
														<mat-error>This is required</mat-error>
													}
												</mat-form-field>
											</div>
										</div>
										<div class="row">
											<div class="col-md-6 col-sm-12">
												<mat-form-field>
													<mat-label>Province/State</mat-label>
													<input matInput formControlName="province" maxlength="100" />
													@if (form.get('province')?.hasError('required')) {
														<mat-error>This is required</mat-error>
													}
												</mat-form-field>
											</div>
											<div class="col-md-6 col-sm-12">
												<mat-form-field>
													<mat-label>Country</mat-label>
													<input matInput formControlName="country" maxlength="100" />
													@if (form.get('country')?.hasError('required')) {
														<mat-error>This is required</mat-error>
													}
												</mat-form-field>
											</div>
										</div>
									}
								</div>
							</div>
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
									@if (
										(form.get('agreeToCompleteAndAccurate')?.dirty ||
											form.get('agreeToCompleteAndAccurate')?.touched) &&
										form.get('agreeToCompleteAndAccurate')?.invalid &&
										form.get('agreeToCompleteAndAccurate')?.hasError('required')
									) {
										<mat-error class="mat-option-error">This is required</mat-error>
									}
								</div>
								<div class="col-md-12 col-sm-12">
									<mat-checkbox formControlName="haveVerifiedIdentity">
										@if (portal === portalTypeCodes.Psso) {
											I have verified the identity of the applicant for this criminal record check
										} @else {
											I confirm that I have verified the identity of the applicant for this criminal record check
										}
									</mat-checkbox>
									@if (
										(form.get('haveVerifiedIdentity')?.dirty || form.get('haveVerifiedIdentity')?.touched) &&
										form.get('haveVerifiedIdentity')?.invalid &&
										form.get('haveVerifiedIdentity')?.hasError('required')
									) {
										<mat-error class="mat-option-error">This is required</mat-error>
									}
								</div>
							</div>

							@if (portal === portalTypeCodes.Crrp) {
								<mat-divider class="my-3"></mat-divider>
								<div class="text-minor-heading fw-semibold mb-2">
									Upload the copy of signed consent form sent by the applicant
								</div>
								<div class="row my-4">
									<div class="col-xxl-8 col-xl-10 col-lg-12">
										<app-file-upload
											[maxNumberOfFiles]="1"
											[control]="attachments"
											[files]="attachments.value"
										></app-file-upload>
										@if (
											(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
											form.get('attachments')?.invalid &&
											form.get('attachments')?.hasError('required')
										) {
											<mat-error class="mat-option-error">This is required</mat-error>
										}
									</div>
								</div>
							}
						</section>
					</div>
				</div>
			</form>
			<div class="row">
				<div class="offset-xxl-6 offset-xl-8 offset-lg-6 col-xxl-2 col-xl-2 col-lg-3 col-md-6 col-sm-12">
					<button mat-stroked-button color="primary" class="large mb-2" (click)="onCancel()">
						<i class="fa fa-times mr-2"></i>Cancel
					</button>
				</div>
				<div class="col-xxl-2 col-xl-2 col-lg-3 col-md-6 col-sm-12">
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
	standalone: false,
})
export class ManualSubmissionCommonComponent implements OnInit {
	pssoVsWarning = SPD_CONSTANTS.message.pssoVsWarning;
	pssoPeCrcWarning = SPD_CONSTANTS.message.pssoPeCrcWarning;
	pssoPeCrcVsWarning = SPD_CONSTANTS.message.pssoPeCrcVsWarning;

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
			genderCode: new FormControl('', [Validators.required]),
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
			haveVerifiedIdentity: new FormControl('', [Validators.requiredTrue]),
			aliases: this.formBuilder.array([]),
			attachments: new FormControl('', [Validators.required]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('screeningType', (_form) => this.showScreeningType ?? false),
				FormGroupValidators.conditionalRequiredValidator('serviceType', (_form) => this.showServiceType ?? false),
				FormGroupValidators.conditionalRequiredValidator('payeeType', (_form) =>
					this.isPeCrc(_form.get('serviceType')?.value ?? false),
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'emailAddress',
					(_form) => this.portal == PortalTypeCode.Crrp,
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(_form) => this.portal == PortalTypeCode.Crrp,
				),
				FormGroupValidators.conditionalRequiredValidator(
					'givenName',
					(form) => form.get('oneLegalName')?.value != true,
				),
				FormGroupValidators.conditionalRequiredValidator('orgId', (_form) => this.showMinistries),
				FormGroupValidators.conditionalRequiredValidator('contractedCompanyName', (form) =>
					[ScreeningTypeCode.Contractor, ScreeningTypeCode.Licensee].includes(form.get('screeningType')?.value),
				),
			],
		},
	);
	maxBirthDate = this.utilService.getBirthDateMax();
	minDate = this.utilService.getDateMin();

	// org id - for PSSO this is the ministry OrgId, otherwise the CRRP org
	@Input() orgId: string | null = null;
	@Input() portal: PortalTypeCode | null = null;
	@Input() isPsaUser: boolean | undefined = undefined;

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
		private dialog: MatDialog,
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
					contractorsNeedVulnerableSectorScreening,
				);
				this.screeningTypes = this.utilService.getScreeningTypes(
					licenseesNeedVulnerableSectorScreening,
					contractorsNeedVulnerableSectorScreening,
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
		this.form.markAllAsTouched();

		if (this.previousNameFlag.value != BooleanTypeCode.Yes) {
			this.aliases.clear();
		}

		if (!this.form.valid) {
			this.utilService.scrollToErrorSection();
			return;
		}

		const createRequest: any = { ...this.form.value } as Parameters<
			ApplicationService['apiOrgsOrgIdApplicationPost']
		>[0]['body']['ApplicationCreateRequestJson'];

		createRequest.originTypeCode = ApplicationOriginTypeCode.OrganizationSubmitted;
		createRequest.phoneNumber = createRequest.phoneNumber
			? this.maskPipe.transform(createRequest.phoneNumber, SPD_CONSTANTS.phone.backendMask)
			: '';
		createRequest.dateOfBirth = this.formatDatePipe.transform(
			createRequest.dateOfBirth,
			SPD_CONSTANTS.date.backendDateFormat,
		);
		createRequest.haveVerifiedIdentity = createRequest.haveVerifiedIdentity == true;
		createRequest.contractedCompanyName = [ScreeningTypeCode.Contractor, ScreeningTypeCode.Licensee].includes(
			createRequest.screeningType,
		)
			? createRequest.contractedCompanyName
			: '';

		if (!this.showScreeningType) {
			createRequest.screeningType = ScreeningTypeCode.Staff;
		}

		createRequest.requireDuplicateCheck = true;

		const body: ManualSubmissionBody = {
			ConsentFormFile: this.portal == PortalTypeCode.Crrp ? this.attachments.value : null,
			ApplicationCreateRequestJson: JSON.stringify(createRequest),
		};

		if (
			this.portal == PortalTypeCode.Psso &&
			createRequest.serviceType != ServiceTypeCode.PssoVs &&
			createRequest.serviceType != ServiceTypeCode.PeCrc &&
			createRequest.serviceType != ServiceTypeCode.PeCrcVs
		) {
			this.saveAndCheckDuplicates(body);
		} else if (
			this.portal == PortalTypeCode.Psso &&
			(createRequest.serviceType === ServiceTypeCode.PeCrc || createRequest.serviceType === ServiceTypeCode.PeCrcVs)
		) {
			this.promptPolicyEnabledCheck(body);
		} else {
			this.promptVulnerableSector(body);
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
				(item: ServiceTypeCode) => ServiceTypes.find((option: SelectOptions) => option.code === item)!,
			) ?? [];
		serviceTypes.sort((a: SelectOptions, b: SelectOptions) =>
			this.utilService.compareByStringUpper(a.desc ?? '', b.desc),
		);
		this.serviceTypes = serviceTypes;

		// if there is only one value, use it and do not show the dropdown
		if (serviceTypes.length === 1) {
			this.serviceTypeDefault = (serviceTypes[0].code as ServiceTypeCode) ?? null;
			this.showServiceType = false;
		} else {
			this.serviceTypeDefault = null;
			this.showServiceType = true;
		}

		this.form.patchValue({ serviceType: this.serviceTypeDefault }, { emitEvent: false });
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

	private promptPolicyEnabledCheck(body: ManualSubmissionBody): void {
		const data: DialogOptions = {
			icon: 'info_outline',
			title: '',
			message: '',
			actionText: 'Yes',
			cancelText: 'No',
		};

		if (this.serviceTypeIsPssoPeCrcVs) {
			data.title = 'Enhanced policy enabled check';
			data.message = SPD_CONSTANTS.message.pssoPeCrcVsPrompt;
		} else {
			// serviceTypeIsPssoPeCrc
			data.title = 'Standard policy enabled check';
			data.message = SPD_CONSTANTS.message.pssoPeCrcPrompt;
		}

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					if (this.serviceTypeIsPssoPeCrc) {
						this.saveAndCheckDuplicates(body);
					} else {
						this.promptVulnerableSector(body);
					}
				}
			});
	}

	private promptVulnerableSector(body: ManualSubmissionBody): void {
		const data: DialogOptions = {
			icon: 'info_outline',
			title: 'Vulnerable sector',
			message: SPD_CONSTANTS.message.pssoVsPrompt,
			actionText: 'Yes',
			cancelText: 'No',
		};

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
			message: SPD_CONSTANTS.message.pssoVsNoWarning,
			actionText: 'Cancel request',
			cancelText: 'Previous',
		};

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
	get serviceTypeIsPssoVs(): boolean {
		return this.form.get('serviceType')?.value === ServiceTypeCode.PssoVs;
	}
	get serviceTypeIsPssoPeCrc(): boolean {
		return this.form.get('serviceType')?.value === ServiceTypeCode.PeCrc;
	}
	get serviceTypeIsPssoPeCrcVs(): boolean {
		return this.form.get('serviceType')?.value === ServiceTypeCode.PeCrcVs;
	}
	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
