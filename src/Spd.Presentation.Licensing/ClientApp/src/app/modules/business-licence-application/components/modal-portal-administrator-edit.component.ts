import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BizPortalUserResponse, BizPortalUserUpdateRequest, ContactAuthorizationTypeCode } from '@app/api/models';
import { ContactAuthorizationTypes, SelectOptions } from '@app/core/code-types/model-desc.models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

export interface BizPortalUserDialogData {
	user: BizPortalUserResponse;
	isAllowedNonPrimaryAdmin: boolean;
	isAllowedPrimaryAdmin: boolean;
	emails: string[]; // used to determine if email is unique within the set
}

@Component({
	selector: 'app-modal-portal-administrator-edit',
	template: `
		<div mat-dialog-title class="mat-dialog-title">{{ title }}</div>
		<mat-dialog-content class="mat-dialog-content">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Authorization Type</mat-label>
							<mat-select formControlName="contactAuthorizationTypeCode">
								<mat-option *ngFor="let auth of authorizationTypes" [value]="auth.code">
									{{ auth.desc }}
								</mat-option>
							</mat-select>
							<mat-error *ngIf="form.get('contactAuthorizationTypeCode')?.hasError('required')">
								This is required
							</mat-error>
						</mat-form-field>
					</div>

					<div class="col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Given Name</mat-label>
							<input matInput formControlName="firstName" [errorStateMatcher]="matcher" maxlength="40" />
						</mat-form-field>
					</div>

					<div class="col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Surname</mat-label>
							<input matInput formControlName="lastName" [errorStateMatcher]="matcher" maxlength="40" />
							<mat-error *ngIf="form.get('lastName')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>

					<div class="col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Phone Number</mat-label>
							<input
								matInput
								formControlName="phoneNumber"
								[errorStateMatcher]="matcher"
								maxlength="30"
								appPhoneNumberTransform
							/>
							<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>

					<div class="col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Email</mat-label>
							<input
								matInput
								formControlName="email"
								placeholder="name@domain.com"
								maxlength="75"
								[errorStateMatcher]="matcher"
							/>
							<mat-error *ngIf="form.get('email')?.hasError('email')">Must be a valid email address</mat-error>
							<mat-error *ngIf="form.get('email')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
					<mat-error *ngIf="emailNotUnique">This email has been used by another portal administrator</mat-error>
				</div>
			</form>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-md-4 col-sm-12 mb-2">
					<button
						mat-stroked-button
						mat-dialog-close
						class="large"
						color="primary"
						aria-label="Cancel changes and close the popup"
					>
						Cancel
					</button>
				</div>
				<div class="offset-md-4 col-md-4 col-sm-12 mb-2">
					<button
						mat-flat-button
						color="primary"
						class="large"
						(click)="onSave()"
						aria-label="Save and close the popup"
					>
						<span *ngIf="!isEdit">Add</span>
						<span *ngIf="isEdit">Update</span>
					</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
	standalone: false,
})
export class ModalPortalAdministratorEditComponent implements OnInit {
	title = '';
	isEdit = false;
	emailNotUnique = false;
	authorizationTypes!: SelectOptions[];

	form = this.businessApplicationService.portalAdministratorFormGroup;

	matcher = new FormErrorStateMatcher();

	constructor(
		private dialogRef: MatDialogRef<ModalPortalAdministratorEditComponent>,
		private businessApplicationService: BusinessApplicationService,
		@Inject(MAT_DIALOG_DATA) public dialogData: BizPortalUserDialogData
	) {}

	ngOnInit(): void {
		const data = this.dialogData.user;
		this.form.reset();
		this.form.patchValue(data);
		this.isEdit = !!data?.id;
		this.title = this.isEdit ? 'Edit Portal Administrator' : 'Add Portal Administrator';

		this.authorizationTypes = ContactAuthorizationTypes.filter((item: SelectOptions) => {
			return (
				(this.dialogData.isAllowedNonPrimaryAdmin && item.code === ContactAuthorizationTypeCode.BusinessManager) ||
				(this.dialogData.isAllowedPrimaryAdmin && item.code === ContactAuthorizationTypeCode.PrimaryBusinessManager)
			);
		});
	}

	onSave(): void {
		const formData = this.form.value;

		this.form.markAllAsTouched();

		// is the email unique?
		const findIndex = this.dialogData.emails.findIndex((item: string) => item === formData.email);

		this.emailNotUnique = findIndex >= 0;

		if (!this.form.valid || this.emailNotUnique) return;

		const body: BizPortalUserUpdateRequest = { ...formData };

		if (this.isEdit) {
			body.id = this.dialogData.user.id as string;
			this.businessApplicationService
				.saveBizPortalUserUpdate(body.id, body)
				.pipe()
				.subscribe((resp: BizPortalUserResponse) => {
					this.dialogRef.close({
						data: resp,
					});
				});
		} else {
			this.businessApplicationService
				.saveBizPortalUserCreate(body)
				.pipe()
				.subscribe((resp: BizPortalUserResponse) => {
					this.dialogRef.close({
						data: resp,
					});
				});
		}
	}
}
