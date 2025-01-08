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
	branchManagerGivenName?: null | string;
	branchManagerMiddleName?: null | string;
	branchManagerSurname?: null | string;
	branchPhoneNumber?: null | string;
	branchEmailAddr?: null | string;
}

@Component({
	selector: 'app-modal-metal-dealers-branch',
	template: `
		<div mat-dialog-title class="mat-dialog-title">{{ title }}</div>
		<mat-dialog-content class="mat-dialog-content">
			<form [formGroup]="form" novalidate>
				<div class="text-minor-heading my-2">Branch Manager</div>
				<div class="row">
					<div class="col-md-4">
						<mat-form-field>
							<mat-label>Manager's Given Name <span class="optional-label">(optional)</span></mat-label>
							<input matInput formControlName="branchManagerMiddleName" maxlength="100" [errorStateMatcher]="matcher" />
						</mat-form-field>
					</div>

					<div class="col-md-4">
						<mat-form-field>
							<mat-label>Manager's Middle Name <span class="optional-label">(optional)</span></mat-label>
							<input matInput formControlName="branchManagerGivenName" maxlength="100" [errorStateMatcher]="matcher" />
						</mat-form-field>
					</div>

					<div class="col-md-4">
						<mat-form-field>
							<mat-label>Manager's Surname</mat-label>
							<input matInput formControlName="branchManagerSurname" maxlength="100" [errorStateMatcher]="matcher" />
							<mat-error *ngIf="form.get('branchManagerSurname')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>

					<div class="col-md-4">
						<mat-form-field>
							<mat-label>Manager's Phone Number</mat-label>
							<input
								matInput
								formControlName="branchPhoneNumber"
								[errorStateMatcher]="matcher"
								[mask]="phoneMask"
								[showMaskTyped]="true"
							/>
							<mat-error *ngIf="form.get('branchPhoneNumber')?.hasError('required')">This is required</mat-error>
							<mat-error *ngIf="form.get('branchPhoneNumber')?.hasError('mask')">This must be 10 digits</mat-error>
						</mat-form-field>
					</div>

					<div class="col-md-4">
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
			<app-form-address [form]="form" [isWideView]="true"></app-form-address>
		</mat-dialog-content>

		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close class="large" color="primary">Cancel</button>
				</div>
				<div class="offset-md-4 col-md-4 col-sm-12 mb-2">
					<button mat-flat-button color="primary" class="large" (click)="onSave()">
						<span *ngIf="isCreate">Add</span>
						<span *ngIf="!isCreate">Update</span>
					</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
	standalone: false,
})
export class ModalMetalDealersBranchComponent implements OnInit {
	title = '';
	isCreate = false;

	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form = this.metalDealersAndRecyclersApplicationService.branchFormGroup;

	matcher = new FormErrorStateMatcher();

	constructor(
		private dialogRef: MatDialogRef<ModalMetalDealersBranchComponent>,
		private metalDealersAndRecyclersApplicationService: MetalDealersApplicationService,
		@Inject(MAT_DIALOG_DATA) public dialogData: MetalDealersAndRecyclersBranchResponse
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
