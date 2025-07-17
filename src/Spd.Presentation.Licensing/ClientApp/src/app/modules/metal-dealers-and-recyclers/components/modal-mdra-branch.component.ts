import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

export interface MetalDealersAndRecyclersBranchResponse {
	isCreate?: null | boolean;
	branchId?: null | number;
	addressSelected?: null | boolean;
	addressLine1?: null | string;
	addressLine2?: null | string;
	city?: null | string;
	country?: null | string;
	postalCode?: null | string;
	province?: null | string;
	branchManager?: null | string;
	branchPhoneNumber?: null | string;
	branchEmailAddr?: null | string;
}

@Component({
	selector: 'app-modal-mdra-branch',
	template: `
		<div mat-dialog-title class="mat-dialog-title">{{ title }}</div>
		<mat-dialog-content class="mat-dialog-content">
			<form [formGroup]="form" novalidate>
				<div class="text-minor-heading mb-3">Branch Manager</div>
				<div class="fs-6 mb-3">
					The branch manager is the person responsible for the day to day management of the business
				</div>

				<div class="row">
					<div class="col-xl-12 col-lg-12 col-md-12">
						<mat-form-field>
							<mat-label>Full Name</mat-label>
							<input matInput formControlName="branchManager" maxlength="150" [errorStateMatcher]="matcher" />
							@if (form.get('branchManager')?.hasError('branchManager')) {
								<mat-error>This is required</mat-error>
							}
						</mat-form-field>
					</div>

					<div class="col-xl-6 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Phone Number</mat-label>
							<input
								matInput
								formControlName="branchPhoneNumber"
								[errorStateMatcher]="matcher"
								[mask]="phoneMask"
								[showMaskTyped]="false"
								[errorStateMatcher]="matcher"
							/>
							@if (form.get('branchPhoneNumber')?.hasError('required')) {
								<mat-error>This is required</mat-error>
							}
							@if (form.get('branchPhoneNumber')?.hasError('mask')) {
								<mat-error>This must be 10 digits</mat-error>
							}
						</mat-form-field>
					</div>

					<div class="col-xl-6 col-lg-6 col-md-12">
						<mat-form-field>
							<mat-label>Email <span class="optional-label">(if any)</span></mat-label>
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
export class ModalMdraBranchComponent implements OnInit {
	title = '';
	isCreate = false;

	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form = this.metalDealersAndRecyclersApplicationService.branchFormGroup;

	matcher = new FormErrorStateMatcher();

	constructor(
		private dialogRef: MatDialogRef<ModalMdraBranchComponent>,
		private metalDealersAndRecyclersApplicationService: MetalDealersApplicationService,
		@Inject(MAT_DIALOG_DATA) public dialogData: MetalDealersAndRecyclersBranchResponse
	) {}

	ngOnInit(): void {
		this.form.reset();
		this.form.patchValue(this.dialogData);

		this.isCreate = this.dialogData.isCreate ?? false;

		if (this.isCreate) {
			this.title = 'Add Branch Office';
		} else {
			this.title = 'Edit Branch Office';
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
