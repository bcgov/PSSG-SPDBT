import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { NgxMaskPipe } from 'ngx-mask';
import {
	BooleanTypeCode,
	ContactAuthorizationTypeCode,
	EmployeeOrganizationTypeCode,
	OrgResponse,
	OrgUpdateRequest,
	PayerPreferenceTypeCode,
	VolunteerOrganizationTypeCode,
} from 'src/app/api/models';
import { OrgService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-organization-profile',
	template: `
		<app-crrp-header></app-crrp-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row mb-2">
				<div class="col-xl-9 col-lg-8 col-md-12 col-sm-12">
					<h2>Organization Profile</h2>
				</div>
				<div class="col-xl-3 col-lg-4 col-md-12 col-sm-12 text-end" *ngIf="viewOnly && editable">
					<button mat-flat-button color="primary" class="large w-auto mb-2" (click)="onEditView()">
						Edit Information
					</button>
				</div>
			</div>
			<form [formGroup]="form" novalidate>
				<div class="row">
					<mat-divider class="mat-divider-main mb-3"></mat-divider>
					<div class="col-xl-4 col-lg-12">
						<div class="ms-3 mb-2">
							<div class="text-minor-heading fw-semibold">Organization Name</div>
							<div class="fw-bold">{{ organizationName.value | default }}</div>
						</div>
					</div>
					<div class="col-xl-4 col-lg-12">
						<div class="ms-3 mb-2">
							<div class="text-minor-heading fw-semibold">Legal Organization Name</div>
							<div class="fw-bold">{{ organizationLegalName.value | default }}</div>
						</div>
					</div>
					<div class="col-xl-4 col-lg-12">
						<div class="ms-3 mb-2">
							<div class="text-minor-heading fw-semibold">Access Code</div>
							<div class="fw-bold">{{ accessCode.value | default }}</div>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Email</mat-label>
							<input matInput formControlName="email" placeholder="name@domain.com" maxlength="75" />
							<mat-error *ngIf="form.get('email')?.hasError('required')"> This is required </mat-error>
							<mat-error *ngIf="form.get('email')?.hasError('email')"> Must be a valid email address </mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Organization Phone Number</mat-label>
							<input matInput formControlName="phoneNumber" [mask]="phoneMask" [showMaskTyped]="false" />
							<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
							<mat-error *ngIf="form.get('phoneNumber')?.hasError('mask')">This must be 10 digits</mat-error>
						</mat-form-field>
					</div>
				</div>

				<mat-divider class="mb-3"></mat-divider>
				<div class="text-minor-heading fw-semibold mb-2">Organization Address</div>
				<div class="row">
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Street Address 1</mat-label>
							<input matInput formControlName="addressLine1" maxlength="100" />
							<mat-error *ngIf="form.get('addressLine1')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Street Address 2 <span class="optional-label">(optional)</span></mat-label>
							<input matInput formControlName="addressLine2" maxlength="100" />
						</mat-form-field>
					</div>
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>City</mat-label>
							<input matInput formControlName="addressCity" maxlength="100" />
							<mat-error *ngIf="form.get('addressCity')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>

				<div class="row">
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Postal Code</mat-label>
							<input
								matInput
								formControlName="addressPostalCode"
								oninput="this.value = this.value.toUpperCase()"
								maxlength="20"
							/>
							<mat-error *ngIf="form.get('addressPostalCode')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Province</mat-label>
							<input matInput formControlName="addressProvince" maxlength="100" />
							<mat-error *ngIf="form.get('addressProvince')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Country</mat-label>
							<input matInput formControlName="addressCountry" maxlength="100" />
							<mat-error *ngIf="form.get('addressCountry')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>

				<ng-container *ngIf="isNotVolunteerOrg">
					<mat-divider class="mb-3"></mat-divider>
					<div class="text-minor-heading fw-semibold mb-2">Who pays for the criminal record checks?</div>
					<div class="mb-2">
						Set who is responsible for paying the fee. You can adjust this when you generate a new criminal record check
						request.
					</div>
					<div class="row">
						<div class="col-xl-4 col-lg-12">
							<mat-radio-group aria-label="Select an option" formControlName="payerPreference" class="d-flex flex-row">
								<mat-radio-button [value]="payerPreferenceTypeCode.Organization">Organization Pays</mat-radio-button>
								<mat-radio-button [value]="payerPreferenceTypeCode.Applicant">Applicant Pays</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('payerPreference')?.dirty || form.get('payerPreference')?.touched) &&
									form.get('payerPreference')?.invalid &&
									form.get('payerPreference')?.hasError('required')
								"
								>An option must be selected</mat-error
							>
						</div>
					</div>
				</ng-container>

				<mat-divider class="mb-3"></mat-divider>
				<div class="text-minor-heading fw-semibold mb-2">
					Do you work with contractors who need vulnerable sector checks?
				</div>
				<div class="row">
					<div class="col-xl-4 col-lg-12">
						<mat-radio-group
							aria-label="Select an option"
							formControlName="contractorsNeedVulnerableSectorScreening"
							class="d-flex flex-row"
						>
							<mat-radio-button [value]="booleanTypeCodes.No">No</mat-radio-button>
							<mat-radio-button [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</mat-radio-group>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('contractorsNeedVulnerableSectorScreening')?.dirty ||
									form.get('contractorsNeedVulnerableSectorScreening')?.touched) &&
								form.get('contractorsNeedVulnerableSectorScreening')?.invalid &&
								form.get('contractorsNeedVulnerableSectorScreening')?.hasError('required')
							"
							>An option must be selected</mat-error
						>
					</div>
				</div>

				<ng-container *ngIf="displayLicenseesQuestion">
					<mat-divider class="mb-3"></mat-divider>
					<div class="text-minor-heading fw-semibold mb-2">
						Do you work with licensees who need vulnerable sector checks?
					</div>
					<div class="row">
						<div class="col-xl-4 col-lg-12">
							<mat-radio-group
								aria-label="Select an option"
								formControlName="licenseesNeedVulnerableSectorScreening"
								class="d-flex flex-row"
							>
								<mat-radio-button [value]="booleanTypeCodes.No" class="mb-0">No</mat-radio-button>
								<mat-radio-button [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('licenseesNeedVulnerableSectorScreening')?.dirty ||
										form.get('licenseesNeedVulnerableSectorScreening')?.touched) &&
									form.get('licenseesNeedVulnerableSectorScreening')?.invalid &&
									form.get('licenseesNeedVulnerableSectorScreening')?.hasError('required')
								"
								>An option must be selected</mat-error
							>
						</div>
					</div>
				</ng-container>
			</form>
			<div class="row" *ngIf="!viewOnly">
				<div class="offset-xl-8 offset-lg-6 col-xl-2 col-lg-3 col-md-6 col-sm-12">
					<button mat-stroked-button color="primary" class="large mb-2" (click)="onCancel()">
						<i class="fa fa-times mr-2"></i>Cancel
					</button>
				</div>
				<div class="col-xl-2 col-lg-3 col-md-6 col-sm-12">
					<button mat-flat-button color="primary" class="large mb-2" (click)="onSave()">Submit</button>
				</div>
			</div>

			<div *ngIf="viewOnly">
				<mat-divider class="mb-3"></mat-divider>
				<button
					mat-stroked-button
					color="primary"
					class="w-auto"
					[routerLink]="[crrpRoutes.path(crrpRoutes.TERMS_AND_CONDITIONS)]"
				>
					<mat-icon class="me-1">description</mat-icon>Terms and Conditions
				</button>
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
export class OrganizationProfileComponent implements OnInit {
	isNotVolunteerOrg = false;
	crrpRoutes = CrrpRoutes;

	editable = true;
	viewOnly = true;
	displayLicenseesQuestion = true;
	phoneMask = SPD_CONSTANTS.phone.displayMask;
	booleanTypeCodes = BooleanTypeCode;
	payerPreferenceTypeCode = PayerPreferenceTypeCode;
	initialValues = {};
	form: FormGroup = this.formBuilder.group(
		{
			organizationName: new FormControl(''),
			organizationLegalName: new FormControl(''),
			accessCode: new FormControl(''),
			email: new FormControl('', [Validators.required, FormControlValidators.email]),
			phoneNumber: new FormControl('', [Validators.required]),
			addressLine1: new FormControl('', [FormControlValidators.required]),
			addressLine2: new FormControl(''),
			addressCity: new FormControl('', [FormControlValidators.required]),
			addressPostalCode: new FormControl('', [FormControlValidators.required]),
			addressProvince: new FormControl('', [FormControlValidators.required]),
			addressCountry: new FormControl('', [FormControlValidators.required]),
			payerPreference: new FormControl('', [FormControlValidators.required]),
			contractorsNeedVulnerableSectorScreening: new FormControl('', [FormControlValidators.required]),
			licenseesNeedVulnerableSectorScreening: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'licenseesNeedVulnerableSectorScreening',
					() => this.displayLicenseesQuestion
				),
				FormGroupValidators.conditionalRequiredValidator('payerPreference', (_form) => this.isNotVolunteerOrg ?? false),
			],
		}
	);
	formValues = {};

	constructor(
		private router: Router,
		private formBuilder: FormBuilder,
		private hotToast: HotToastService,
		private maskPipe: NgxMaskPipe,
		private orgService: OrgService,
		private authUserService: AuthUserBceidService
	) {}

	ngOnInit(): void {
		const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		if (!orgId) {
			console.debug('OrganizationProfileComponent - missing orgId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.isNotVolunteerOrg = this.authUserService.bceidUserOrgProfile?.isNotVolunteerOrg ?? false;

		this.editable =
			this.authUserService.bceidUserInfoProfile?.contactAuthorizationTypeCode == ContactAuthorizationTypeCode.Primary;
		this.orgService
			.apiOrgsOrgIdGet({ orgId: this.authUserService.bceidUserInfoProfile?.orgId! })
			.pipe()
			.subscribe((resp: OrgResponse) => {
				this.form.patchValue(resp);
				this.initialValues = this.form.value;

				// SPDBT-876 - work with licensees – only visible if Employer Org type or Volunteer Org Type equals:
				// "Childcare" "Healthcare" "Govn Body" (only employee) "Prov Govt"
				if (resp.employeeOrganizationTypeCode) {
					this.displayLicenseesQuestion = [
						EmployeeOrganizationTypeCode.Childcare,
						EmployeeOrganizationTypeCode.Healthcare,
						EmployeeOrganizationTypeCode.GovnBody,
						EmployeeOrganizationTypeCode.ProvGovt,
					].includes(resp.employeeOrganizationTypeCode);
				} else if (resp.volunteerOrganizationTypeCode) {
					this.displayLicenseesQuestion = [
						VolunteerOrganizationTypeCode.Childcare,
						VolunteerOrganizationTypeCode.Healthcare,
						VolunteerOrganizationTypeCode.ProvGovt,
					].includes(resp.volunteerOrganizationTypeCode);
				}
				this.setFormView();
			});
	}

	onCancel(): void {
		this.viewOnly = true;
		this.form.reset(this.initialValues);
		this.form.disable();
	}

	onEdit(): void {
		this.viewOnly = false;
		this.form.enable();
	}

	onEditView() {
		this.viewOnly = !this.viewOnly;
		this.setFormView();
	}

	onSave() {
		this.form.markAllAsTouched();
		if (this.form.valid) {
			const body: OrgUpdateRequest = { ...this.form.value, id: this.authUserService.bceidUserInfoProfile?.orgId! };
			if (body.phoneNumber) {
				body.phoneNumber = this.maskPipe.transform(body.phoneNumber, SPD_CONSTANTS.phone.backendMask);
			}
			if (!this.displayLicenseesQuestion) {
				body.licenseesNeedVulnerableSectorScreening = undefined;
			}

			this.orgService
				.apiOrgsOrgIdPut({ orgId: this.authUserService.bceidUserInfoProfile?.orgId!, body })
				.pipe()
				.subscribe((resp: OrgUpdateRequest) => {
					this.viewOnly = true;
					this.form.disable();
					this.form.patchValue({ ...resp });
					this.initialValues = this.form.value;
					this.authUserService.setUserOrgProfile();
					this.hotToast.success('Organization Information was successfully updated');
				});
		}
	}

	private setFormView(): void {
		if (this.viewOnly) {
			this.form.disable();
		} else {
			this.form.enable();
		}
	}

	get organizationName(): FormControl {
		return this.form.get('organizationName') as FormControl;
	}

	get organizationLegalName(): FormControl {
		return this.form.get('organizationLegalName') as FormControl;
	}

	get accessCode(): FormControl {
		return this.form.get('accessCode') as FormControl;
	}
}
