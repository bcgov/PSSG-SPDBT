import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { BusinessApplicationService } from '../../services/business-application.service';
import { BranchResponse } from './step-business-licence-bc-branches.component';

export interface UserDialogData {
	// user: OrgUserResponse;
	isAllowedPrimary: boolean;
}

@Component({
	selector: 'app-member-without-swl-edit-modal',
	template: `
		<div mat-dialog-title>{{ title }}</div>
		<mat-dialog-content>
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-6 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Given Name</mat-label>
							<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
							<mat-error *ngIf="form.get('givenName')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-6 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
							<input matInput formControlName="middleName1" maxlength="40" />
						</mat-form-field>
					</div>
					<div class="col-xl-6 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
							<input matInput formControlName="middleName2" maxlength="40" />
						</mat-form-field>
					</div>
					<div class="col-xl-6 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Surname</mat-label>
							<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
							<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>
					<div class="col-xl-6 col-lg-6 col-md-12">
						<mat-form-field *ngIf="!noEmailAddress.value">
							<mat-label>Email</mat-label>
							<input
								matInput
								formControlName="emailAddress"
								placeholder="name@domain.com"
								maxlength="75"
								[errorStateMatcher]="matcher"
							/>
							<mat-error *ngIf="form.get('emailAddress')?.hasError('email')"> Must be a valid email address </mat-error>
							<mat-error *ngIf="form.get('emailAddress')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
						<mat-checkbox formControlName="noEmailAddress"> Doesn’t have an email address </mat-checkbox>
					</div>
					<div class="col-xl-6 col-lg-6 col-md-12" *ngIf="noEmailAddress.value">
						<app-alert type="danger" icon="error">
							Download the Consent to Criminal Record Check form and provide it to the member to fill out.
						</app-alert>
					</div>
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
export class MemberWithoutSwlEditModalComponent implements OnInit {
	title = '';
	isEdit = false;

	form = this.businessApplicationService.memberWithoutSwlFormGroup;

	phoneMask = SPD_CONSTANTS.phone.displayMask;
	matcher = new FormErrorStateMatcher();

	constructor(
		private dialogRef: MatDialogRef<MemberWithoutSwlEditModalComponent>,
		private businessApplicationService: BusinessApplicationService,
		@Inject(MAT_DIALOG_DATA) public dialogData: BranchResponse
	) {}

	ngOnInit(): void {
		this.form.reset();
		this.form.patchValue(this.dialogData);
		this.isEdit = !!this.dialogData.id;
		this.title = this.dialogData.id ? 'Edit Member' : 'Add Member';
	}

	onSave(): void {
		this.form.markAllAsTouched();
		if (!this.form.valid) return;

		const formValue = this.form.value;
		if (this.noEmailAddress.value) {
			formValue.emailAddress = null;
		}

		this.dialogRef.close({
			data: this.form.value,
		});
	}

	get noEmailAddress(): FormControl {
		return this.form.get('noEmailAddress') as FormControl;
	}
}