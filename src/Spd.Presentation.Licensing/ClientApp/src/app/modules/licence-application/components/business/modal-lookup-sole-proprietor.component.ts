import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LicenceStatusCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { CommonApplicationService, LicenceLookupResult } from '../../services/common-application.service';
import { BranchResponse } from './common-business-bc-branches.component';

@Component({
	selector: 'app-modal-lookup-sole-proprietor',
	template: `
		<div mat-dialog-title>Add Sole Proprietor</div>
		<mat-dialog-content class="pb-0">
			<div class="fs-6 fw-normal pb-3">A sole proprietor must have a valid security worker licence</div>
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
									<div class="row">
										<div class="col-md-6 col-sm-12">
											<div class="d-block text-muted mt-2">Name</div>
											<div class="text-data">{{ searchResult.name }}</div>
										</div>
										<div class="col-md-6 col-sm-12">
											<div class="d-block text-muted mt-2">Security Worker Licence Number</div>
											<div class="text-data">{{ searchResult.licenceNumber }}</div>
										</div>
										<div class="col-md-6 col-sm-12">
											<div class="d-block text-muted mt-2">Expiry Date</div>
											<div class="text-data">{{ searchResult.expiryDate }}</div>
										</div>
										<div class="col-md-6 col-sm-12">
											<div class="d-block text-muted mt-2">Licence Status</div>
											<div class="text-data fw-bold">{{ searchResult.status }}</div>
										</div>
									</div>
								</app-alert>
							</div>
						</ng-container>

						<ng-template #IsFoundInvalid>
							<div class="mt-3">
								<app-alert type="warning" icon="">
									<div class="fs-5 mb-2">This licence is not valid</div>
									<div class="row">
										<div class="col-md-6 col-sm-12">
											<div class="d-block text-muted mt-2">Security Worker Licence Number</div>
											<div class="text-data">{{ searchResult.licenceNumber }}</div>
										</div>
										<div class="col-md-6 col-sm-12">
											<div class="d-block text-muted mt-2">Expiry Date</div>
											<div class="text-data">{{ searchResult.expiryDate }}</div>
										</div>
										<div class="col-md-6 col-sm-12">
											<div class="d-block text-muted mt-2">Licence Status</div>
											<div class="text-data fw-bold">{{ searchResult.status }}</div>
										</div>
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
export class ModalLookupSoleProprietorComponent implements OnInit {
	form = this.businessApplicationService.soleProprietorFormGroup;

	searchResult: any = null;

	isSearchPerformed = false;
	isFoundValid = false;
	isFound = false;

	constructor(
		private dialogRef: MatDialogRef<ModalLookupSoleProprietorComponent>,
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

		const licenceNumber = this.licenceNumberLookup.value;
		this.commonApplicationService
			.getLicenceNumberLookup(licenceNumber)
			.pipe()
			.subscribe((resp: LicenceLookupResult) => {
				this.isSearchPerformed = resp.isSearchPerformed;
				this.isFound = !!resp;
				this.isFoundValid = resp.isFoundValid;

				if (resp.searchResult) {
					this.searchResult = {
						id: resp.searchResult.licenceId,
						name:
							resp.searchResult.licenceStatusCode === LicenceStatusCode.Active
								? resp.searchResult.licenceHolderName
								: '',
						licenceNumber: resp.searchResult.licenceNumber,
						status: resp.searchResult.licenceStatusCode,
						expiryDate: resp.searchResult.expiryDate,
					};
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
