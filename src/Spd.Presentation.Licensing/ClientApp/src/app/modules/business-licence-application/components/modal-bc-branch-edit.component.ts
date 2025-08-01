import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { BranchResponse } from './business-bc-branches.component';

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
							@if (form.get('branchManager')?.hasError('required')) {
								<mat-error>This is required</mat-error>
							}
						</mat-form-field>
					</div>

					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Manager's Phone Number</mat-label>
							<input
								matInput
								formControlName="branchPhoneNumber"
								[errorStateMatcher]="matcher"
								maxlength="30"
								appPhoneNumberTransform
							/>
							@if (form.get('branchPhoneNumber')?.hasError('required')) {
								<mat-error>This is required</mat-error>
							}
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
							@if (form.get('branchEmailAddr')?.hasError('email')) {
								<mat-error>Must be a valid email address</mat-error>
							}
						</mat-form-field>
					</div>
				</div>
			</form>

			<div class="text-minor-heading my-2">Branch Address</div>
			<app-form-address [form]="form" [isWideView]="true"></app-form-address>
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
						@if (isCreate) {
							<span>Add</span>
						}
						@if (!isCreate) {
							<span>Update</span>
						}
					</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
	standalone: false,
})
export class ModalBcBranchEditComponent implements OnInit {
	title = '';
	isCreate = false;

	form = this.businessApplicationService.branchInBcFormGroup;

	matcher = new FormErrorStateMatcher();

	constructor(
		private dialogRef: MatDialogRef<ModalBcBranchEditComponent>,
		private businessApplicationService: BusinessApplicationService,
		@Inject(MAT_DIALOG_DATA) public dialogData: BranchResponse
	) {}

	ngOnInit(): void {
		this.form.reset();
		this.form.patchValue(this.dialogData);

		this.isCreate = this.dialogData.isCreate ?? false;

		if (this.isCreate) {
			this.title = 'Add Branch';
		} else {
			this.title = 'Edit Branch';
			this.form.patchValue({ addressSelected: true });
		}
	}

	onSave(): void {
		this.form.markAllAsTouched();
		if (!this.form.valid) return;

		this.dialogRef.close({
			data: this.form.value,
		});
	}
}
