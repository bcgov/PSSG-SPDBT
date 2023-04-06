import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { NgxMaskPipe } from 'ngx-mask';
import { BooleanTypeCode, OrgResponse, OrgUpdateRequest, PayerPreferenceTypeCode } from 'src/app/api/models';
import { OrgService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';

@Component({
	selector: 'app-settings',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row mb-4">
				<div class="col-xl-6 col-lg-4 col-md-12 col-sm-12">
					<h2 class="fw-normal">Organization Profile</h2>
				</div>
				<div class="col-xl-3 col-lg-4 col-md-12 col-sm-12">
					<button mat-stroked-button color="primary" class="large mb-2" *ngIf="!viewOnly" (click)="onCancel()">
						<i class="fa fa-times mr-2"></i>Cancel
					</button>
				</div>
				<div class="col-xl-3 col-lg-4 col-md-12 col-sm-12">
					<button mat-raised-button color="primary" class="large mb-2" (click)="onToggleViewOnly()">
						<span *ngIf="viewOnly; else save">Edit Information </span>
						<ng-template #save> Save Information </ng-template>
					</button>
				</div>
			</div>
			<form [formGroup]="form" novalidate>
				<mat-divider class="my-3"></mat-divider>
				<div class="row">
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Organization Name</mat-label>
							<input matInput formControlName="organizationName" maxlength="160" />
							<mat-error *ngIf="form.get('organizationName')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Legal Organization Name</mat-label>
							<input matInput formControlName="organizationLegalName" maxlength="160" />
							<mat-error *ngIf="form.get('organizationLegalName')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>

				<div class="row">
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Email Address</mat-label>
							<input matInput formControlName="email" placeholder="name@domain.com" maxlength="75" />
							<mat-error *ngIf="form.get('email')?.hasError('required')"> This is required </mat-error>
							<mat-error *ngIf="form.get('email')?.hasError('email')"> Must be a valid email address </mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Organization Phone Number</mat-label>
							<input matInput formControlName="phoneNumber" [mask]="phoneMask" [showMaskTyped]="true" />
							<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>

				<mat-divider class="my-3"></mat-divider>
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

				<mat-divider class="my-3"></mat-divider>
				<div class="text-minor-heading fw-semibold mb-2">Who pays for screenings?</div>
				<div class="mb-2">
					Set who is responsible for paying the screening fee. You can adjust this when you generate a screening
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

				<mat-divider class="my-3"></mat-divider>
				<div class="text-minor-heading fw-semibold mb-2">
					Do you work with contractors who need vulnerable sector screenings?
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

				<mat-divider class="my-3"></mat-divider>
				<div class="text-minor-heading fw-semibold mb-2">
					Do you work with licensees who need vulnerable sector screenings?
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
export class SettingsComponent implements OnInit {
	viewOnly: boolean = true;
	phoneMask = SPD_CONSTANTS.phone.displayMask;
	booleanTypeCodes = BooleanTypeCode;
	payerPreferenceTypeCode = PayerPreferenceTypeCode;
	initialValues = {};
	form: FormGroup = this.formBuilder.group({
		organizationName: new FormControl('', [Validators.required]),
		organizationLegalName: new FormControl('', [Validators.required]),
		email: new FormControl('', [Validators.required, Validators.email]),
		phoneNumber: new FormControl('', [Validators.required]),
		addressLine1: new FormControl('', [Validators.required]),
		addressLine2: new FormControl(''),
		addressCity: new FormControl('', [Validators.required]),
		addressPostalCode: new FormControl('', [Validators.required]),
		addressProvince: new FormControl('', [Validators.required]),
		addressCountry: new FormControl('', [Validators.required]),
		payerPreference: new FormControl('', [Validators.required]),
		contractorsNeedVulnerableSectorScreening: new FormControl('', [Validators.required]),
		licenseesNeedVulnerableSectorScreening: new FormControl('', [Validators.required]),
	});
	startAt = SPD_CONSTANTS.date.birthDateStartAt;
	formValues = {};

	constructor(
		private formBuilder: FormBuilder,
		private hotToast: HotToastService,
		private maskPipe: NgxMaskPipe,
		private orgService: OrgService
	) {}

	ngOnInit(): void {
		//TODO replace with proper org id
		this.orgService
			.apiOrgOrgIdGet({ orgId: '4165bdfe-7cb4-ed11-b83e-00505683fbf4' })
			.pipe()
			.subscribe((resp: OrgResponse) => {
				this.form.patchValue(resp);
				this.initialValues = this.form.value;
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

	onToggleViewOnly() {
		if (!this.viewOnly) {
			this.form.markAllAsTouched();
			console.log('this.form.valid', this.form.valid);
			if (this.form.valid) {
				//TODO replace with proper org id
				const body: OrgUpdateRequest = { ...this.form.value, id: '4165bdfe-7cb4-ed11-b83e-00505683fbf4' };
				if (body.phoneNumber) {
					body.phoneNumber = this.maskPipe.transform(body.phoneNumber, SPD_CONSTANTS.phone.backendMask);
				}

				this.orgService
					.apiOrgOrgIdPut({ orgId: '4165bdfe-7cb4-ed11-b83e-00505683fbf4', body })
					.pipe()
					.subscribe((resp: OrgUpdateRequest) => {
						this.viewOnly = true;
						this.form.disable();
						this.form.patchValue({ ...resp });
						this.initialValues = this.form.value;
						this.hotToast.success('Organization Information was successfully updated');
					});
			}
		} else {
			this.viewOnly = !this.viewOnly;
			this.setFormView();
		}
	}

	private setFormView(): void {
		if (this.viewOnly) {
			this.form.disable();
		} else {
			this.form.enable();
		}
	}
}
