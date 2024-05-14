import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { CommonApplicationService, LicenceLookupResult } from '../../services/common-application.service';
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

				<ng-container *ngIf="isSearchPerformed">
					<ng-container *ngIf="isFound; else IsNotFound">
						<ng-container *ngIf="isFoundValid; else IsFoundInvalid">
							<div class="my-3">
								<app-alert type="info" icon="">
									<div class="fs-5">{{ searchResult.licenceHolderName }} has been found with a valid licence</div>
								</app-alert>
							</div>
						</ng-container>

						<ng-template #IsFoundInvalid>
							<div class="mt-3">
								<app-alert type="warning" icon="">
									<div class="fs-5">{{ searchResult.licenceHolderName }} has been found with an expired licence</div>
									<div class="mt-2">
										'Cancel' to exit this dialog and then add them as a member without a security worker licence to
										proceed.
									</div>
								</app-alert>
							</div>
						</ng-template>
					</ng-container>

					<ng-template #IsNotFound>
						<app-alert type="danger" icon="error">
							This licence number does not match any existing Security Worker licences
						</app-alert>
					</ng-template>
				</ng-container>
			</form>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close class="large" color="primary">Cancel</button>
				</div>
				<div class="offset-md-4 col-md-4 col-sm-12 mb-2" *ngIf="isFoundValid">
					<button mat-flat-button color="primary" class="large" (click)="onSave()">Add</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
})
export class ModalMemberWithSwlAddComponent implements OnInit {
	form = this.businessApplicationService.memberWithSwlFormGroup;

	searchResult: any = null;

	isSearchPerformed = false;
	isFoundValid = false;
	isFound = false;

	constructor(
		private dialogRef: MatDialogRef<ModalMemberWithSwlAddComponent>,
		private businessApplicationService: BusinessApplicationService,
		private commonApplicationService: CommonApplicationService,
		@Inject(MAT_DIALOG_DATA) public dialogData: BranchResponse
	) {}

	ngOnInit(): void {
		this.form.reset();
		this.form.patchValue(this.dialogData);
	}

	onSearch(): void {
		this.resetFlags();

		this.form.markAllAsTouched();
		if (!this.form.valid) return;

		this.commonApplicationService
			.getLicenceNumberLookup(this.licenceNumberLookup.value)
			.pipe()
			.subscribe((resp: LicenceLookupResult) => {
				this.isSearchPerformed = resp.isSearchPerformed;
				this.isFound = resp.isFound;
				this.isFoundValid = resp.isFoundValid;

				if (resp.searchResult) {
					if (resp.searchResult.workerLicenceTypeCode !== WorkerLicenceTypeCode.SecurityWorkerLicence) {
						this.isFoundValid = false;
					}

					this.searchResult = resp.searchResult;
				}
			});
	}

	onSave(): void {
		if (!this.isFoundValid) return;

		this.dialogRef.close({
			data: this.searchResult,
		});
	}

	resetFlags(): void {
		this.searchResult = null;

		this.isSearchPerformed = false;
		this.isFound = false;
		this.isFoundValid = false;
	}

	get licenceNumberLookup(): FormControl {
		return this.form.get('licenceNumberLookup') as FormControl;
	}
}
