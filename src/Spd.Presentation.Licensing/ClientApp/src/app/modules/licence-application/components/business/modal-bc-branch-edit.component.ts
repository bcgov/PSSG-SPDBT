import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { BranchResponse } from './common-business-bc-branches.component';

export interface UserDialogData {
	// user: OrgUserResponse;
	isAllowedPrimary: boolean;
}

@Component({
	selector: 'app-modal-bc-branch-edit',
	template: `
		<div mat-dialog-title class="mat-dialog-title">{{ title }}</div>
		<mat-dialog-content class="mat-dialog-content">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-md-12">
						<mat-form-field>
							<mat-label>Branch Manager</mat-label>
							<input matInput formControlName="branchManager" maxlength="100" [errorStateMatcher]="matcher" />
							<mat-error *ngIf="form.get('branchManager')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>

					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Manager's Phone Number <span class="optional-label">(optional)</span></mat-label>
							<input
								matInput
								formControlName="branchPhoneNumber"
								[mask]="phoneMask"
								[showMaskTyped]="false"
								[errorStateMatcher]="matcher"
							/>
							<mat-error *ngIf="form.get('branchPhoneNumber')?.hasError('mask')">This must be 10 digits</mat-error>
						</mat-form-field>
					</div>

					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Manager's Email <span class="optional-label">(optional)</span></mat-label>
							<input
								matInput
								formControlName="branchEmailAddr"
								placeholder="name@domain.com"
								maxlength="75"
								[errorStateMatcher]="matcher"
							/>
							<mat-error *ngIf="form.get('branchEmailAddr')?.hasError('email')">
								Must be a valid email address
							</mat-error>
						</mat-form-field>
					</div>
				</div>
			</form>

			<div class="text-minor-heading my-2">Branch Address</div>
			<app-common-address [form]="form" [isWizardStep]="false"></app-common-address>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close class="large" color="primary">Cancel</button>
				</div>
				<div class="offset-md-4 col-md-4 col-sm-12 mb-2">
					<button mat-flat-button color="primary" class="large" (click)="onSave()">Apply</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
})
export class ModalBcBranchEditComponent implements OnInit {
	title = '';
	isEdit = false;

	form = this.businessApplicationService.branchInBcFormGroup;

	phoneMask = SPD_CONSTANTS.phone.displayMask;
	matcher = new FormErrorStateMatcher();

	constructor(
		private dialogRef: MatDialogRef<ModalBcBranchEditComponent>,
		private businessApplicationService: BusinessApplicationService,
		@Inject(MAT_DIALOG_DATA) public dialogData: BranchResponse
	) {}

	ngOnInit(): void {
		this.form.reset();
		this.form.patchValue(this.dialogData);
		this.isEdit = !!this.dialogData.branchId;
		this.title = this.dialogData.branchId ? 'Edit Branch' : 'Add Branch';
	}

	onSave(): void {
		this.form.markAllAsTouched();
		if (!this.form.valid) return;

		this.dialogRef.close({
			data: this.form.value,
		});
	}
}
