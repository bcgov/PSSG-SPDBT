import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxMaskPipe } from 'ngx-mask';
import { ContactAuthorizationTypeCode, OrgUserResponse, OrgUserUpdateRequest } from 'src/app/api/models';
import { OrgUserService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';

export const ContactAuthorizationTypes = [
	{ desc: 'Primary Authorized Contact', code: ContactAuthorizationTypeCode.Primary },
	{ desc: 'Authorized Contact', code: ContactAuthorizationTypeCode.Contact },
];

export interface UserDialogData {
	user: OrgUserResponse;
	isAllowedPrimary: boolean;
}

@Component({
	selector: 'app-maintain-user-modal',
	template: `
		<div mat-dialog-title>{{ title }}</div>
		<mat-dialog-content>
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Authorization Type</mat-label>
							<mat-select formControlName="contactAuthorizationTypeCode">
								<mat-option *ngFor="let auth of authorizationTypes" [value]="auth.code">
									{{ auth.desc }}
								</mat-option>
							</mat-select>
						</mat-form-field>
					</div>
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Given Name</mat-label>
							<input matInput formControlName="firstName" />
							<mat-error *ngIf="form.get('firstName')?.hasError('required')">This is required</mat-error>
							<mat-error *ngIf="form.get('firstName')?.hasError('maxlength')">
								This must be at most 40 characters long
							</mat-error>
						</mat-form-field>
					</div>
				</div>

				<div class="row">
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Surname</mat-label>
							<input matInput formControlName="lastName" />
							<mat-error *ngIf="form.get('lastName')?.hasError('required')">This is required</mat-error>
							<mat-error *ngIf="form.get('lastName')?.hasError('maxlength')">
								This must be at most 40 characters long
							</mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Email Address</mat-label>
							<input matInput formControlName="email" placeholder="name@domain.com" />
							<mat-error *ngIf="form.get('email')?.hasError('email')"> Must be a valid email address </mat-error>
							<mat-error *ngIf="form.get('email')?.hasError('required')">This is required</mat-error>
							<mat-error *ngIf="form.get('email')?.hasError('maxlength')">
								This must be at most 75 characters long
							</mat-error>
						</mat-form-field>
					</div>
				</div>

				<div class="row" *ngIf="isEdit">
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Phone Number</mat-label>
							<input matInput formControlName="phoneNumber" [mask]="phoneMask" [showMaskTyped]="true" />
							<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
							<mat-error *ngIf="form.get('phoneNumber')?.hasError('maxlength')">
								This must be at most 12 characters long
							</mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Job Title</mat-label>
							<input matInput formControlName="jobTitle" />
							<mat-error *ngIf="form.get('jobTitle')?.hasError('required')">This is required</mat-error>
							<mat-error *ngIf="form.get('jobTitle')?.hasError('maxlength')">
								This must be at most 100 characters long
							</mat-error>
						</mat-form-field>
					</div>
				</div>

				<div class="row" *ngIf="isEdit">
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Date of Birth</mat-label>
							<input matInput [matDatepicker]="picker" formControlName="dateOfBirth" />
							<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
							<mat-datepicker #picker startView="multi-year" [startAt]="startAt"></mat-datepicker>
							<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>
			</form>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close color="primary">Cancel</button>
				</div>
				<div class="offset-md-4 col-md-4 col-sm-12 mb-2">
					<button mat-raised-button color="primary" (click)="onSave()">Save</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
})
export class MaintainUserModalComponent {
	authorizationTypes = ContactAuthorizationTypes;
	phoneMask = SPD_CONSTANTS.phone.displayMask;
	title: string = '';
	isEdit = false;
	form: FormGroup = this.formBuilder.group(
		{
			contactAuthorizationTypeCode: new FormControl('', [Validators.required]),
			lastName: new FormControl('', [Validators.required, Validators.maxLength(40)]),
			firstName: new FormControl('', [Validators.required, Validators.maxLength(40)]),
			email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(75)]),
			phoneNumber: new FormControl('', [Validators.required, Validators.maxLength(12)]),
			jobTitle: new FormControl('', [Validators.required, Validators.maxLength(100)]),
			dateOfBirth: new FormControl('', [Validators.required]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('phoneNumber', () => this.isEdit),
				FormGroupValidators.conditionalRequiredValidator('jobTitle', () => this.isEdit),
				FormGroupValidators.conditionalRequiredValidator('dateOfBirth', () => this.isEdit),
			],
		}
	);
	startAt = SPD_CONSTANTS.date.birthDateStartAt;

	constructor(
		private formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<MaintainUserModalComponent>,
		private orgUserService: OrgUserService,
		private maskPipe: NgxMaskPipe,
		@Inject(MAT_DIALOG_DATA) public dialogData: UserDialogData
	) {}

	ngOnInit(): void {
		this.form.patchValue(this.dialogData.user);
		this.isEdit = this.dialogData.user.id ? true : false;
		this.title = this.dialogData.user.id ? 'Edit User' : 'Add User';

		if (!this.dialogData.isAllowedPrimary) {
			this.authorizationTypes = ContactAuthorizationTypes.filter(
				(item) => item.code != ContactAuthorizationTypeCode.Primary
			);
		}
	}

	onSave(): void {
		this.form.markAllAsTouched();
		if (this.form.valid) {
			const formData = this.form.value;

			const body: OrgUserUpdateRequest = { ...formData };
			if (body.phoneNumber) {
				body.phoneNumber = this.maskPipe.transform(body.phoneNumber, SPD_CONSTANTS.phone.backendMask);
			}

			if (this.isEdit) {
				body.id = this.dialogData.user.id as string;
				body.organizationId = this.dialogData.user.organizationId;
				this.orgUserService
					.apiOrgsOrgIdUsersUserIdPut({ userId: body.id, orgId: body.organizationId!, body })
					.pipe()
					.subscribe((resp: OrgUserResponse) => {
						this.dialogRef.close({
							data: resp,
						});
					});
			} else {
				// TODO replace with proper org id
				body.organizationId = '4165bdfe-7cb4-ed11-b83e-00505683fbf4';
				this.orgUserService
					.apiOrgsOrgIdUsersPost({ orgId: body.organizationId, body })
					.pipe()
					.subscribe((resp: OrgUserResponse) => {
						this.dialogRef.close({
							data: resp,
						});
					});
			}
		}
	}
}
