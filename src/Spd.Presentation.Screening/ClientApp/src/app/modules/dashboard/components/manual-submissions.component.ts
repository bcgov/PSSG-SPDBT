import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { NgxMaskPipe } from 'ngx-mask';
import {
	ApplicationManualSubmissionCreateRequest,
	BooleanTypeCode,
	CheckManualSubmissionDuplicateResponse,
	EmployeeInteractionTypeCode,
	PayerPreferenceTypeCode,
} from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { Address, AddressAutocompleteComponent } from 'src/app/shared/components/address-autocomplete.component';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';

export const EmployeeInteractionTypes = [
	{ desc: 'Children', code: EmployeeInteractionTypeCode.Children },
	{ desc: 'Vulnerable Adults', code: EmployeeInteractionTypeCode.Adults },
	{ desc: 'Children and Vulnerable Adults', code: EmployeeInteractionTypeCode.ChildrenAndAdults },
];
@Component({
	selector: 'app-manual-submissions',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row mb-4">
				<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12">
					<h2 class="fw-normal">
						Manual Submissions
						<div class="mt-2 fs-5 fw-light">
							Enter the applicant's information and upload their completed consent form
						</div>
					</h2>
				</div>
				<div class="col-xl-2 col-lg-3 col-md-6 col-sm-12">
					<button mat-stroked-button color="primary" class="large mb-2" (click)="onCancel()">
						<i class="fa fa-times mr-2"></i>Cancel
					</button>
				</div>
				<div class="col-xl-2 col-lg-3 col-md-6 col-sm-12">
					<button mat-raised-button color="primary" class="large mb-2" (click)="onSubmit()">Submit</button>
				</div>
			</div>
			<form [formGroup]="form" novalidate>
				<mat-divider class="my-3"></mat-divider>
				<div class="text-minor-heading fw-semibold mb-2">Applicant Information</div>
				<mat-checkbox formControlName="oneLegalName"> I have one legal name </mat-checkbox>
				<div class="row">
					<div class="col-xl-3 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Legal Given Name</mat-label>
							<input matInput formControlName="givenName" />
							<mat-error *ngIf="form.get('givenName')?.hasError('required')"> This is required </mat-error>
							<mat-error *ngIf="form.get('givenName')?.hasError('maxlength')">
								This must be at most 40 characters long
							</mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-3 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
							<input matInput formControlName="middleName1" />
							<mat-error *ngIf="form.get('middleName1')?.hasError('maxlength')">
								This must be at most 40 characters long
							</mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-3 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
							<input matInput formControlName="middleName2" />
							<mat-error *ngIf="form.get('middleName2')?.hasError('maxlength')">
								This must be at most 40 characters long
							</mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-3 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Legal Surname</mat-label>
							<input matInput formControlName="surname" />
							<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
							<mat-error *ngIf="form.get('surname')?.hasError('maxlength')">
								This must be at most 40 characters long
							</mat-error>
						</mat-form-field>
					</div>

					<div class="col-xl-3 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Email Address</mat-label>
							<input matInput formControlName="emailAddress" />
							<mat-error *ngIf="form.get('emailAddress')?.hasError('required')"> This is required </mat-error>
							<mat-error *ngIf="form.get('emailAddress')?.hasError('maxlength')">
								This must be at most 75 characters long
							</mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-3 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Phone Number</mat-label>
							<input matInput formControlName="phoneNumber" [mask]="phoneMask" [showMaskTyped]="true" />
							<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-3 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>BC Drivers License <span class="optional-label">(optional)</span></mat-label>
							<input matInput formControlName="driversLicense" />
						</mat-form-field>
					</div>
					<div class="col-xl-3 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Birth Place</mat-label>
							<input matInput formControlName="birthPlace" />
							<mat-error *ngIf="form.get('birthPlace')?.hasError('required')"> This is required </mat-error>
							<mat-error *ngIf="form.get('birthPlace')?.hasError('maxlength')">
								This must be at most 100 characters long
							</mat-error>
						</mat-form-field>
					</div>

					<div class="col-xl-3 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Date of Birth</mat-label>
							<input matInput [matDatepicker]="picker" formControlName="dateOfBirth" />
							<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
							<mat-datepicker #picker startView="multi-year" [startAt]="startAt"></mat-datepicker>
							<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-3 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Job Title</mat-label>
							<input matInput formControlName="jobTitle" />
							<mat-error *ngIf="form.get('jobTitle')?.hasError('required')">This is required</mat-error>
							<mat-error *ngIf="form.get('jobTitle')?.hasError('maxlength')">
								This must be at most 100 characters long
							</mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-3 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Vulnerable Sector Category</mat-label>
							<mat-select formControlName="vulnerableSectorCategory">
								<mat-option *ngFor="let interaction of employeeInteractionTypes" [value]="interaction.code">
									{{ interaction.desc }}
								</mat-option>
							</mat-select>
							<mat-error *ngIf="form.get('vulnerableSectorCategory')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>

				<mat-divider class="my-3"></mat-divider>
				<div class="text-minor-heading fw-semibold mb-2">Has the applicant ever had a previous name?</div>
				<div class="row">
					<div class="col-xl-4 col-lg-12">
						<mat-radio-group aria-label="Select an option" formControlName="previousNameFlag" class="d-flex flex-row">
							<mat-radio-button class="me-4" style="width: initial;" [value]="booleanTypeCodes.No">No</mat-radio-button>
							<mat-radio-button [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</mat-radio-group>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('previousNameFlag')?.dirty || form.get('previousNameFlag')?.touched) &&
								form.get('previousNameFlag')?.invalid &&
								form.get('previousNameFlag')?.hasError('required')
							"
							>An option must be selected</mat-error
						>
					</div>
				</div>

				<div class="row mt-2" *ngIf="previousNameFlag.value == booleanTypeCodes.Yes">
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
						<div class="text-minor-heading fw-semibold mb-2">Aliases</div>
						<div class="row">
							<div class="col-xl-1 col-lg-1 col-md-1 col-sm-1 mb-2" style="text-align: end;">
								<span class="badge rounded-pill bg-success"> 1 </span>
							</div>
							<div class="col-xl-3 col-lg-3 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Alias Given Name <span class="optional-label">(optional)</span></mat-label>
									<input matInput type="text" formControlName="alias1GivenName" />
								</mat-form-field>
							</div>
							<div class="col-xl-3 col-lg-3 col-md-5 col-sm-12">
								<mat-form-field>
									<mat-label>Alias Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
									<input matInput type="text" formControlName="alias1MiddleName1" />
								</mat-form-field>
							</div>
							<div class="col-xl-2 col-lg-2 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Alias Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
									<input matInput type="text" formControlName="alias1MiddleName2" />
								</mat-form-field>
							</div>
							<div class="col-xl-3 col-lg-3 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Alias Surname</mat-label>
									<input matInput type="text" formControlName="alias1Surname" required />
								</mat-form-field>
							</div>
						</div>

						<div class="row">
							<div class="col-xl-1 col-lg-1 col-md-1 col-sm-1 mb-2" style="text-align: end;">
								<span class="badge rounded-pill bg-success"> 2 </span>
							</div>
							<div class="col-xl-3 col-lg-3 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Alias Given Name <span class="optional-label">(optional)</span></mat-label>
									<input matInput type="text" formControlName="alias2GivenName" />
								</mat-form-field>
							</div>
							<div class="col-xl-3 col-lg-3 col-md-5 col-sm-12">
								<mat-form-field>
									<mat-label>Alias Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
									<input matInput type="text" formControlName="alias2MiddleName1" />
								</mat-form-field>
							</div>
							<div class="col-xl-2 col-lg-2 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Alias Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
									<input matInput type="text" formControlName="alias2MiddleName2" />
								</mat-form-field>
							</div>
							<div class="col-xl-3 col-lg-3 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Alias Surname</mat-label>
									<input matInput type="text" formControlName="alias2Surname" required />
								</mat-form-field>
							</div>
						</div>

						<div class="row">
							<div class="col-xl-1 col-lg-1 col-md-1 col-sm-1 mb-2" style="text-align: end;">
								<span class="badge rounded-pill bg-success"> 3 </span>
							</div>
							<div class="col-xl-3 col-lg-3 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Alias Given Name <span class="optional-label">(optional)</span></mat-label>
									<input matInput type="text" formControlName="alias3GivenName" />
								</mat-form-field>
							</div>
							<div class="col-xl-3 col-lg-3 col-md-5 col-sm-12">
								<mat-form-field>
									<mat-label>Alias Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
									<input matInput type="text" formControlName="alias3MiddleName1" />
								</mat-form-field>
							</div>
							<div class="col-xl-2 col-lg-2 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Alias Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
									<input matInput type="text" formControlName="alias3MiddleName2" />
								</mat-form-field>
							</div>
							<div class="col-xl-3 col-lg-3 col-md-6 col-sm-12">
								<mat-form-field>
									<mat-label>Alias Surname</mat-label>
									<input matInput type="text" formControlName="alias3Surname" required />
								</mat-form-field>
							</div>
						</div>
					</div>
				</div>

				<mat-divider class="my-3"></mat-divider>
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
								(form.dirty || form.touched) &&
								form.get('addressSelected')?.invalid &&
								form.get('addressSelected')?.hasError('required')
							"
						>
							This is required
						</mat-error>
					</div>
				</div>

				<section *ngIf="form.get('addressSelected')?.value">
					<div class="row">
						<div class="col-lg-8 col-md-12 col-sm-12">
							<div class="text-minor-heading fw-semibold mb-2">Address Information</div>
							<mat-form-field>
								<mat-label>Street Address 1</mat-label>
								<input matInput formControlName="addressLine1" />
								<mat-error *ngIf="form.get('addressLine1')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('addressLine1')?.hasError('maxlength')">
									This must be at most 100 characters long
								</mat-error>
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-8 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>Street Address 2 <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="addressLine2" />
								<mat-error *ngIf="form.get('addressLine2')?.hasError('maxlength')">
									This must be at most 100 characters long
								</mat-error>
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>City</mat-label>
								<input matInput formControlName="city" />
								<mat-error *ngIf="form.get('city')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('city')?.hasError('maxlength')">
									This must be at most 100 characters long
								</mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Postal/Zip Code</mat-label>
								<input matInput formControlName="postalCode" oninput="this.value = this.value.toUpperCase()" />
								<mat-error *ngIf="form.get('postalCode')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('postalCode')?.hasError('maxlength')">
									This must be at most 20 characters long
								</mat-error>
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Province/State</mat-label>
								<input matInput formControlName="province" />
								<mat-error *ngIf="form.get('province')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('province')?.hasError('maxlength')">
									This must be at most 100 characters long
								</mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Country</mat-label>
								<input matInput formControlName="country" />
								<mat-error *ngIf="form.get('country')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('country')?.hasError('maxlength')">
									This must be at most 100 characters long
								</mat-error>
							</mat-form-field>
						</div>
					</div>
				</section>

				<mat-divider class="my-3"></mat-divider>
				<div class="text-minor-heading fw-semibold mb-2">Declaration</div>
				<div class="row">
					<div class="col-md-12 col-sm-12">
						<mat-checkbox formControlName="agreeToCompleteAndAccurate">
							I certify that, to the best of my knowledge, the information I have provided and will provide as necessary
							is complete and accurate
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
							I confirm that I have verified the identity of the applicant for this security screening
						</mat-checkbox>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('haveVerifiedIdentity')?.dirty || form.get('haveVerifiedIdentity')?.touched) &&
								form.get('haveVerifiedIdentity')?.invalid &&
								form.get('haveVerifiedIdentity')?.hasError('required')
							"
							>This is required</mat-error
						>
					</div>
				</div>

				<mat-divider class="my-3"></mat-divider>
				<div class="text-minor-heading fw-semibold mb-2">
					Upload the copy of signed consent form sent by the applicant
				</div>
				<div class="my-4">
					<ngx-dropzone
						#fileDropzone
						(change)="onUploadFile($event)"
						[multiple]="multiple"
						[maxFileSize]="maxFileSize"
						[disableClick]="disableClick"
						[expandable]="expandable"
					>
						<ngx-dropzone-label>
							<div class="my-2">
								<div class="mt-4 mb-2">
									<mat-icon class="upload-file-icon">cloud_upload</mat-icon>
								</div>
								<div class="mb-4">
									<strong>Drag and Drop your file here or click to browse</strong>
								</div>
							</div>
						</ngx-dropzone-label>

						<ngx-dropzone-preview
							class="preview"
							*ngFor="let f of form.get('files')?.value"
							[removable]="true"
							(removed)="onRemoveFile(f)"
						>
							<ngx-dropzone-label style="width: 100%;">
								<div class="row">
									<div class="col-12 d-flex p-0 fw-bold text-start" style="text-indent: 1em; color: black;">
										<!-- <img class="file-name-icon" src="/assets/tsv_file.png" /> -->
									</div>
								</div>
							</ngx-dropzone-label>
						</ngx-dropzone-preview>
					</ngx-dropzone>
				</div>
			</form>
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
export class ManualSubmissionsComponent {
	@ViewChild(AddressAutocompleteComponent) addressAutocompleteComponent!: AddressAutocompleteComponent;

	employeeInteractionTypes = EmployeeInteractionTypes;
	multiple: boolean = false;
	expandable: boolean = true;
	disableClick: boolean = false;
	maxFileSize: number = 104857600; // bytes

	phoneMask = SPD_CONSTANTS.phone.displayMask;
	booleanTypeCodes = BooleanTypeCode;
	payerPreferenceTypeCode = PayerPreferenceTypeCode;
	form: FormGroup = this.formBuilder.group(
		{
			givenName: new FormControl('', [Validators.required, Validators.maxLength(40)]),
			middleName1: new FormControl('', [Validators.maxLength(40)]),
			middleName2: new FormControl('', [Validators.maxLength(40)]),
			surname: new FormControl('', [Validators.required, Validators.maxLength(40)]),
			oneLegalName: new FormControl(false),
			emailAddress: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(75)]),
			phoneNumber: new FormControl('', [Validators.required]),
			driversLicense: new FormControl(''),
			dateOfBirth: new FormControl(null, [Validators.required]),
			birthPlace: new FormControl('', [Validators.required, Validators.maxLength(100)]),
			jobTitle: new FormControl('', [Validators.required, Validators.maxLength(100)]),
			vulnerableSectorCategory: new FormControl('', [Validators.required]),
			previousNameFlag: new FormControl('', [Validators.required]),
			alias1GivenName: new FormControl(''),
			alias1MiddleName1: new FormControl(''),
			alias1MiddleName2: new FormControl(''),
			alias1Surname: new FormControl(''),
			alias2GivenName: new FormControl(''),
			alias2MiddleName1: new FormControl(''),
			alias2MiddleName2: new FormControl(''),
			alias2Surname: new FormControl(''),
			alias3GivenName: new FormControl(''),
			alias3MiddleName1: new FormControl(''),
			alias3MiddleName2: new FormControl(''),
			alias3Surname: new FormControl(''),
			addressSelected: new FormControl(false, [Validators.requiredTrue]),
			addressLine1: new FormControl('', [Validators.required, Validators.maxLength(100)]),
			addressLine2: new FormControl('', [Validators.maxLength(100)]),
			city: new FormControl('', [Validators.required, Validators.maxLength(100)]),
			postalCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
			province: new FormControl('', [Validators.required, Validators.maxLength(100)]),
			country: new FormControl('', [Validators.required, Validators.maxLength(100)]),
			agreeToCompleteAndAccurate: new FormControl('', [Validators.required]),
			haveVerifiedIdentity: new FormControl('', [Validators.required]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('givenName', (form) => !form.get('oneLegalName')?.value),
			],
		}
	);
	startAt = SPD_CONSTANTS.date.birthDateStartAt;

	constructor(
		private formBuilder: FormBuilder,
		private applicationService: ApplicationService,
		private hotToast: HotToastService,
		private maskPipe: NgxMaskPipe,
		private dialog: MatDialog
	) {}

	onCancel(): void {}

	onSubmit() {
		this.form.markAllAsTouched();
		if (this.form.valid) {
			console.log('form', this.form.value);
			const body: ApplicationManualSubmissionCreateRequest = { ...this.form.value };

			//TODO replace with proper org id
			// Check for potential duplicate
			this.applicationService
				.apiOrgsOrgIdDetectManualSubmissionDuplicatePost({ orgId: '4165bdfe-7cb4-ed11-b83e-00505683fbf4', body })
				.pipe()
				.subscribe((dupres: CheckManualSubmissionDuplicateResponse) => {
					if (dupres.hasPotentialDuplicate) {
						const data: DialogOptions = {
							icon: 'warning',
							title: 'Potential Duplicate Detected',
							message: 'A potential duplicate has been found. Are you sure this is a new application?',
							actionText: 'Yes, create application',
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
				});
		}
	}

	saveManualSubmission(body: ApplicationManualSubmissionCreateRequest): void {
		if (body.phoneNumber) {
			body.phoneNumber = this.maskPipe.transform(body.phoneNumber, SPD_CONSTANTS.phone.backendMask);
		}

		//TODO replace with proper org id
		this.applicationService
			.apiOrgsOrgIdManualSubmissionPost({
				orgId: '4165bdfe-7cb4-ed11-b83e-00505683fbf4',
				body,
			})
			.pipe()
			.subscribe((_resp: any) => {
				this.hotToast.success('The application was successfully created');
				this.addressAutocompleteComponent.onClearData();
				this.form.reset();
			});
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

	onUploadFile(evt: any) {}

	onRemoveFile(evt: any) {}

	get previousNameFlag(): FormControl {
		return this.form.get('previousNameFlag') as FormControl;
	}
}
