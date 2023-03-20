import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BooleanTypeCode, PayerPreferenceTypeCode } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';

@Component({
	selector: 'app-settings',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-4 p-md-4 p-sm-0">
			<div class="row mb-4">
				<div class="col-xl-6 col-lg-4 col-md-12 col-sm-12">
					<h2 class="fw-normal">Organization Information</h2>
				</div>
				<div class="col-xl-3 col-lg-4 col-md-12 col-sm-12">
					<button mat-stroked-button color="primary" class="large mb-2" *ngIf="!viewOnly" (click)="onCancel()">
						<i class="fa fa-times mr-2"></i>Cancel
					</button>
				</div>
				<div class="col-xl-3 col-lg-4 col-md-12 col-sm-12">
					<button mat-flat-button color="primary" class="large mb-2" (click)="onToggleViewOnly()">
						<span *ngIf="viewOnly; else save">Edit Information </span>
						<ng-template #save> Save Information </ng-template>
					</button>
				</div>
			</div>
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Organization Name</mat-label>
							<input matInput formControlName="organizationName" />
							<mat-error *ngIf="form.get('organizationName')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Legal Organization Name</mat-label>
							<input matInput formControlName="legalOrganizationName" />
							<mat-error *ngIf="form.get('legalOrganizationName')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>

				<div class="row">
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Email Address</mat-label>
							<input matInput formControlName="emailAddress" placeholder="name@domain.com" />
							<mat-error *ngIf="form.get('emailAddress')?.hasError('required')"> This is required </mat-error>
							<mat-error *ngIf="form.get('emailAddress')?.hasError('emailAddress')">
								Must be a valid email address
							</mat-error>
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
							<mat-label>Street Address #1</mat-label>
							<input matInput formControlName="addressLine1" />
							<mat-error *ngIf="form.get('addressLine1')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Street Address #2</mat-label>
							<input matInput formControlName="addressLine2" />
							<mat-error *ngIf="form.get('addressLine2')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>City</mat-label>
							<input matInput formControlName="addressCity" />
							<mat-error *ngIf="form.get('addressCity')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>

				<div class="row">
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Postal Code</mat-label>
							<input matInput formControlName="addressPostalCode" />
							<mat-error *ngIf="form.get('addressPostalCode')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Province</mat-label>
							<input matInput formControlName="addressProvince" />
							<mat-error *ngIf="form.get('addressProvince')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-4 col-lg-12">
						<mat-form-field>
							<mat-label>Country</mat-label>
							<input matInput formControlName="addressCountry" />
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
						<mat-radio-group aria-label="Select an option" formControlName="whoPays">
							<mat-radio-button [value]="payerPreferenceTypeCode.Organization">Organization Pays</mat-radio-button>
							<mat-radio-button [value]="payerPreferenceTypeCode.Applicant">Applicant Pays</mat-radio-button>
						</mat-radio-group>
						<mat-error
							*ngIf="
								(form.get('whoPays')?.dirty || form.get('whoPays')?.touched) &&
								form.get('whoPays')?.invalid &&
								form.get('whoPays')?.hasError('required')
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
						<mat-radio-group aria-label="Select an option" formControlName="contractorScreening">
							<mat-radio-button [value]="booleanTypeCodes.No">No</mat-radio-button>
							<mat-radio-button [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</mat-radio-group>
						<mat-error
							*ngIf="
								(form.get('contractorScreening')?.dirty || form.get('contractorScreening')?.touched) &&
								form.get('contractorScreening')?.invalid &&
								form.get('contractorScreening')?.hasError('required')
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
						<mat-radio-group aria-label="Select an option" formControlName="licenseeScreening">
							<mat-radio-button [value]="booleanTypeCodes.No" class="mb-0">No</mat-radio-button>
							<mat-radio-button [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</mat-radio-group>
						<mat-error
							*ngIf="
								(form.get('licenseeScreening')?.dirty || form.get('licenseeScreening')?.touched) &&
								form.get('licenseeScreening')?.invalid &&
								form.get('licenseeScreening')?.hasError('required')
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
export class SettingsComponent {
	viewOnly: boolean = true;
	phoneMask = SPD_CONSTANTS.phone.displayMask;
	booleanTypeCodes = BooleanTypeCode;
	payerPreferenceTypeCode = PayerPreferenceTypeCode;
	initialValues = {};
	form: FormGroup = this.formBuilder.group({
		organizationName: new FormControl('MacDonalds', [Validators.required]),
		legalOrganizationName: new FormControl('', [Validators.required]),
		emailAddress: new FormControl('', [Validators.required, Validators.email]),
		phoneNumber: new FormControl('', [Validators.required]),
		addressLine1: new FormControl('', [Validators.required]),
		addressLine2: new FormControl(''),
		addressCity: new FormControl('', [Validators.required]),
		addressPostalCode: new FormControl('', [Validators.required]),
		addressProvince: new FormControl('', [Validators.required]),
		addressCountry: new FormControl('', [Validators.required]),
		whoPays: new FormControl('', [Validators.required]),
		contractorScreening: new FormControl('', [Validators.required]),
		licenseeScreening: new FormControl('', [Validators.required]),
	});
	startAt = SPD_CONSTANTS.date.birthDateStartAt;
	formValues = {};

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.initialValues = {
			organizationName: 'MacDonalds',
			legalOrganizationName: 'MacDonalds Inc.',
			emailAddress: 'mac@donalds.com',
			phoneNumber: '2504447788',
			addressLine1: '',
			addressLine2: '',
			addressCity: '',
			addressPostalCode: '',
			addressProvince: '',
			addressCountry: '',
			whoPays: '',
			contractorScreening: '',
			licenseeScreening: '',
		};
		this.form.patchValue(this.initialValues);
		this.setFormView();
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
				// TODO save changes
				this.viewOnly = true;
				this.form.disable();
				this.initialValues = this.form.value;
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
