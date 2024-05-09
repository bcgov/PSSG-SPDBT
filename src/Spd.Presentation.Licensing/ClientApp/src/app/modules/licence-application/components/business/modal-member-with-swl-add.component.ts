import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { BranchResponse } from './common-business-bc-branches.component';

@Component({
	selector: 'app-modal-member-with-swl-add',
	template: `
		<div mat-dialog-title>Add Member with Security Worker Licence</div>
		<mat-dialog-content class="pb-0">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-md-8 col-sm-12">
						<mat-form-field>
							<mat-label>Lookup a Licence Number</mat-label>
							<input
								matInput
								type="search"
								formControlName="licenceNumberLookup"
								oninput="this.value = this.value.toUpperCase()"
								maxlength="10"
							/>
							<mat-error *ngIf="form.get('licenceNumberLookup')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-4 col-sm-12">
						<button mat-flat-button color="primary" class="large" (click)="onSearch()">Search</button>
					</div>
				</div>

				<div class="my-3" *ngIf="foundSuccess">
					<div class="fs-5">{{ foundSuccess }} has been found with a valid licence</div>
				</div>

				<div class="mt-3" *ngIf="foundIsExpired">
					<div class="fs-5 my-2">{{ foundIsExpired }} has been found with an expired licence</div>
					<div>
						<app-alert type="warning" icon="warning">
							<div>This member's licence has expired.</div>
							<div>Add them as a member without a security worker licence to proceed.</div>
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
				<div class="offset-md-4 col-md-4 col-sm-12 mb-2" *ngIf="foundSuccess">
					<button mat-flat-button color="primary" class="large" (click)="onSave()">Add</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
})
export class ModalMemberWithSwlAddComponent implements OnInit {
	form = this.businessApplicationService.memberWithSwlFormGroup;

	foundSuccess: string | null = null;
	foundIsExpired: string | null = null;

	constructor(
		private dialogRef: MatDialogRef<ModalMemberWithSwlAddComponent>,
		private businessApplicationService: BusinessApplicationService,
		@Inject(MAT_DIALOG_DATA) public dialogData: BranchResponse
	) {}

	ngOnInit(): void {
		this.form.reset();
		this.form.patchValue(this.dialogData);
	}

	onSearch(): void {
		this.form.markAllAsTouched();
		if (!this.form.valid) return;

		this.foundSuccess = null;
		this.foundIsExpired = null;

		this.foundSuccess = 'Timothy Test';
		// this.foundIsExpired = 'Timothy Test';
	}

	onSave(): void {
		if (!this.foundSuccess) return;

		const newData = {
			id: 1,
			givenName: 'Timothy',
			surname: 'Test',
			licenceNumber: this.licenceNumberLookup.value,
			status: 'Valid',
			expiryDate: '2025-06-25',
			clearanceStatus: null,
		};

		this.dialogRef.close({
			data: newData,
		});
	}

	get licenceNumberLookup(): FormControl {
		return this.form.get('licenceNumberLookup') as FormControl;
	}
}
