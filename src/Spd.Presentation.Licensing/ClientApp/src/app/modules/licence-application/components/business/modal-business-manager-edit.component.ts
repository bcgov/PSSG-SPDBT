import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

export interface UserDialogData {
	// user: OrgUserResponse;
	isAllowedPrimary: boolean;
}

@Component({
	selector: 'app-modal-business-manager-edit',
	template: `
		<div mat-dialog-title>{{ title }}</div>
		<mat-dialog-content>
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Given Name</mat-label>
							<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
							<mat-error *ngIf="form.get('givenName')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>
					<div class="col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
							<input matInput formControlName="middleName1" maxlength="40" />
						</mat-form-field>
					</div>
					<div class="col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
							<input matInput formControlName="middleName2" maxlength="40" />
						</mat-form-field>
					</div>
					<div class="col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Surname</mat-label>
							<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
							<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>

					<div class="col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Phone Number</mat-label>
							<input
								matInput
								formControlName="phoneNumber"
								[mask]="phoneMask"
								[showMaskTyped]="false"
								[errorStateMatcher]="matcher"
							/>
							<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
							<mat-error *ngIf="form.get('phoneNumber')?.hasError('mask')">This must be 10 digits</mat-error>
						</mat-form-field>
					</div>

					<div class="col-lg-6 col-md-12">
						<mat-form-field>
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
export class ModalBusinessManagerEditComponent implements OnInit {
	title = '';
	isEdit = false;

	form = this.businessApplicationService.managerFormGroup;

	phoneMask = SPD_CONSTANTS.phone.displayMask;
	matcher = new FormErrorStateMatcher();

	constructor(
		private dialogRef: MatDialogRef<ModalBusinessManagerEditComponent>,
		private businessApplicationService: BusinessApplicationService,
		@Inject(MAT_DIALOG_DATA) public dialogData: any
	) {}

	ngOnInit(): void {
		this.form.reset();
		this.form.patchValue(this.dialogData);
		this.isEdit = !!this.dialogData.id;
		this.title = this.dialogData.id ? 'Edit Business Manager' : 'Add Business Manager';
	}

	onSave(): void {
		this.form.markAllAsTouched();
		if (!this.form.valid) return;

		this.dialogRef.close({
			data: this.form.value,
		});
	}
}