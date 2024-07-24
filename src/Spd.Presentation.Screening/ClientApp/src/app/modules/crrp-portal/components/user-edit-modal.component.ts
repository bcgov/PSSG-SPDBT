import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxMaskPipe } from 'ngx-mask';
import { ContactAuthorizationTypeCode, OrgUserResponse, OrgUserUpdateRequest } from 'src/app/api/models';
import { OrgUserService } from 'src/app/api/services';
import { ContactAuthorizationTypes } from 'src/app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';

export interface UserDialogData {
	user: OrgUserResponse;
	isAllowedPrimary: boolean;
	emails: string[]; // used to determine if email is unique within the set
}

@Component({
	selector: 'app-user-edit-modal',
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
							<input matInput formControlName="firstName" maxlength="40" />
							<mat-error *ngIf="form.get('firstName')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Surname</mat-label>
							<input matInput formControlName="lastName" maxlength="40" />
							<mat-error *ngIf="form.get('lastName')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Email</mat-label>
							<input matInput formControlName="email" placeholder="name@domain.com" maxlength="75" />
							<mat-error *ngIf="form.get('email')?.hasError('email')"> Must be a valid email address </mat-error>
							<mat-error *ngIf="form.get('email')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Phone Number</mat-label>
							<input matInput formControlName="phoneNumber" [mask]="phoneMask" [showMaskTyped]="false" />
							<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
							<mat-error *ngIf="form.get('phoneNumber')?.hasError('mask')">This must be 10 digits</mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Job Title</mat-label>
							<input matInput formControlName="jobTitle" maxlength="100" />
							<mat-error *ngIf="form.get('jobTitle')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
					<mat-error class="mb-2" *ngIf="emailNotUnique">The email has been used by another manager</mat-error>
				</div>
			</form>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close class="large" color="primary">Cancel</button>
				</div>
				<div class="offset-md-4 col-md-4 col-sm-12 mb-2">
					<button mat-flat-button color="primary" class="large" (click)="onSave()">Save</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
})
export class UserEditModalComponent implements OnInit {
	authorizationTypes = ContactAuthorizationTypes;
	phoneMask = SPD_CONSTANTS.phone.displayMask;
	title = '';
	isEdit = false;
	emailNotUnique = false;
	form: FormGroup = this.formBuilder.group(
		{
			contactAuthorizationTypeCode: new FormControl('', [FormControlValidators.required]),
			lastName: new FormControl('', [FormControlValidators.required]),
			firstName: new FormControl('', [FormControlValidators.required]),
			email: new FormControl('', [Validators.required, FormControlValidators.email]),
			phoneNumber: new FormControl('', [Validators.required]),
			jobTitle: new FormControl('', [FormControlValidators.required]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('phoneNumber', () => this.isEdit),
				FormGroupValidators.conditionalRequiredValidator('jobTitle', () => this.isEdit),
			],
		}
	);

	constructor(
		private formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<UserEditModalComponent>,
		private orgUserService: OrgUserService,
		private maskPipe: NgxMaskPipe,
		private authUserService: AuthUserBceidService,
		@Inject(MAT_DIALOG_DATA) public dialogData: UserDialogData
	) {}

	ngOnInit(): void {
		this.form.patchValue(this.dialogData.user);
		this.isEdit = !!this.dialogData.user.id;
		this.title = this.dialogData.user.id ? 'Edit User' : 'Add User';

		if (!this.dialogData.isAllowedPrimary) {
			this.authorizationTypes = ContactAuthorizationTypes.filter(
				(item) => item.code != ContactAuthorizationTypeCode.Primary
			);
		}
	}

	onSave(): void {
		this.form.markAllAsTouched();

		const formData = this.form.value;

		// is the email unique?
		const findIndex = this.dialogData.emails.findIndex((item: string) => item === formData.email);

		this.emailNotUnique = findIndex >= 0;

		if (!this.form.valid || this.emailNotUnique) return;

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
			body.organizationId = this.authUserService.bceidUserInfoProfile?.orgId!;
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
