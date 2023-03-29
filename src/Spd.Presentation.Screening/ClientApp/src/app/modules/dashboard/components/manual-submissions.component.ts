import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { NgxMaskPipe } from 'ngx-mask';
import { BooleanTypeCode, EmployeeInteractionTypeCode, PayerPreferenceTypeCode } from 'src/app/api/models';
import { OrgService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { Address } from 'src/app/shared/components/address-autocomplete.component';

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
					<button mat-flat-button color="primary" class="large mb-2" (click)="onSubmit()">Submit</button>
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
							<input matInput formControlName="firstName" />
							<mat-error *ngIf="form.get('firstName')?.hasError('required')"> This is required </mat-error>
							<mat-error *ngIf="form.get('firstName')?.hasError('maxlength')">
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
							<input matInput formControlName="lastName" />
							<mat-error *ngIf="form.get('lastName')?.hasError('required')"> This is required </mat-error>
							<mat-error *ngIf="form.get('lastName')?.hasError('maxlength')">
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
							<input matInput formControlName="birthplace" />
							<mat-error *ngIf="form.get('birthplace')?.hasError('required')"> This is required </mat-error>
							<mat-error *ngIf="form.get('birthplace')?.hasError('maxlength')">
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
									<input matInput type="text" formControlName="alias1FirstName" />
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
									<input matInput type="text" formControlName="alias1LastName" required />
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
									<input matInput type="text" formControlName="alias2FirstName" />
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
									<input matInput type="text" formControlName="alias2LastName" required />
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
									<input matInput type="text" formControlName="alias3FirstName" />
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
									<input matInput type="text" formControlName="alias3LastName" required />
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
								<input matInput formControlName="mailingAddressLine1" />
								<mat-error *ngIf="form.get('mailingAddressLine1')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('mailingAddressLine1')?.hasError('maxlength')">
									This must be at most 100 characters long
								</mat-error>
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-8 col-md-12 col-sm-12">
							<mat-form-field>
								<mat-label>Street Address 2 <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="mailingAddressLine2" />
								<mat-error *ngIf="form.get('mailingAddressLine2')?.hasError('maxlength')">
									This must be at most 100 characters long
								</mat-error>
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>City</mat-label>
								<input matInput formControlName="mailingCity" />
								<mat-error *ngIf="form.get('mailingCity')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('mailingCity')?.hasError('maxlength')">
									This must be at most 100 characters long
								</mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Postal/Zip Code</mat-label>
								<input matInput formControlName="mailingPostalCode" oninput="this.value = this.value.toUpperCase()" />
								<mat-error *ngIf="form.get('mailingPostalCode')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('mailingPostalCode')?.hasError('maxlength')">
									This must be at most 20 characters long
								</mat-error>
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Province/State</mat-label>
								<input matInput formControlName="mailingProvince" />
								<mat-error *ngIf="form.get('mailingProvince')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('mailingProvince')?.hasError('maxlength')">
									This must be at most 100 characters long
								</mat-error>
							</mat-form-field>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Country</mat-label>
								<input matInput formControlName="mailingCountry" />
								<mat-error *ngIf="form.get('mailingCountry')?.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('mailingCountry')?.hasError('maxlength')">
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
						[accept]="accept"
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
	employeeInteractionTypes = EmployeeInteractionTypes;
	multiple: boolean = false;
	expandable: boolean = true;
	disableClick: boolean = false;
	maxFileSize: number = 104857600; // bytes
	accept = '.tsv';

	phoneMask = SPD_CONSTANTS.phone.displayMask;
	booleanTypeCodes = BooleanTypeCode;
	payerPreferenceTypeCode = PayerPreferenceTypeCode;
	form: FormGroup = this.formBuilder.group(
		{
			firstName: new FormControl('', [Validators.required, Validators.maxLength(40)]),
			middleName1: new FormControl('', [Validators.maxLength(40)]),
			middleName2: new FormControl('', [Validators.maxLength(40)]),
			lastName: new FormControl('', [Validators.required, Validators.maxLength(40)]),
			oneLegalName: new FormControl(false),
			emailAddress: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(75)]),
			phoneNumber: new FormControl('', [Validators.required]),
			driversLicense: new FormControl(''),
			dateOfBirth: new FormControl('', [Validators.required]),
			birthplace: new FormControl('', [Validators.required, Validators.maxLength(100)]),
			jobTitle: new FormControl('', [Validators.required, Validators.maxLength(100)]),
			vulnerableSectorCategory: new FormControl('', [Validators.required]),
			previousNameFlag: new FormControl('', [Validators.required]),
			alias1FirstName: new FormControl(''),
			alias1MiddleName1: new FormControl(''),
			alias1MiddleName2: new FormControl(''),
			alias1LastName: new FormControl(''),
			alias2FirstName: new FormControl(''),
			alias2MiddleName1: new FormControl(''),
			alias2MiddleName2: new FormControl(''),
			alias2LastName: new FormControl(''),
			alias3FirstName: new FormControl(''),
			alias3MiddleName1: new FormControl(''),
			alias3MiddleName2: new FormControl(''),
			alias3LastName: new FormControl(''),
			addressSelected: new FormControl(false, [Validators.requiredTrue]),
			mailingAddressLine1: new FormControl('', [Validators.required, Validators.maxLength(100)]),
			mailingAddressLine2: new FormControl('', [Validators.maxLength(100)]),
			mailingCity: new FormControl('', [Validators.required, Validators.maxLength(100)]),
			mailingPostalCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
			mailingProvince: new FormControl('', [Validators.required, Validators.maxLength(100)]),
			mailingCountry: new FormControl('', [Validators.required, Validators.maxLength(100)]),
			agreeToCompleteAndAccurate: new FormControl('', [Validators.required]),
			haveVerifiedIdentity: new FormControl('', [Validators.required]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('firstName', (form) => !form.get('oneLegalName')?.value),
			],
		}
	);
	startAt = SPD_CONSTANTS.date.birthDateStartAt;

	constructor(
		private formBuilder: FormBuilder,
		private hotToast: HotToastService,
		private maskPipe: NgxMaskPipe,
		private orgService: OrgService
	) {}

	ngOnInit(): void {}

	onCancel(): void {}

	onSubmit() {
		this.form.markAllAsTouched();
		if (this.form.valid) {
			// Check for potential duplicate
			// this.orgRegistrationService
			// .apiOrgRegistrationsDetectDuplicatePost({ body })
			// .pipe()
			// .subscribe((dupres: CheckDuplicateResponse) => {
			//   if (dupres.hasPotentialDuplicate) {
			//     const data: DialogOptions = {
			//       icon: 'error_outline',
			//       title: 'Potential Duplicate Detected',
			//       message:
			//         'A potential duplicate has been found. Are you sure this is a new organization registration request?',
			//       actionText: 'Yes, create registration',
			//       cancelText: 'Cancel',
			//     };
			//     this.dialog
			//       .open(DialogComponent, { data })
			//       .afterClosed()
			//       .subscribe((response: boolean) => {
			//         // Save potential duplicate
			//         body.hasPotentialDuplicate = BooleanTypeCode.Yes;
			//         if (response) {
			//           this.saveRegistration(body);
			//         }
			//       });
			//   } else {
			//     // Save registration
			//     this.saveRegistration(body);
			//   }
			// });
		}
	}

	onAddressAutocomplete(address: Address): void {
		if (!address) {
			this.form.patchValue({
				addressSelected: false,
				mailingAddressLine1: '',
				mailingAddressLine2: '',
				mailingCity: '',
				mailingPostalCode: '',
				mailingProvince: '',
				mailingCountry: '',
			});
			return;
		}

		const { countryCode, provinceCode, postalCode, line1, line2, city } = address;
		this.form.patchValue({
			addressSelected: true,
			mailingAddressLine1: line1,
			mailingAddressLine2: line2,
			mailingCity: city,
			mailingPostalCode: postalCode,
			mailingProvince: provinceCode,
			mailingCountry: countryCode,
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
