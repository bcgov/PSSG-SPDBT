import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { CommonApplicationService, LicenceLookupResult } from '../../services/common-application.service';

export interface LookupSwlDialogData {
	title: string;
	subtitle?: string;
	notValidSwlMessage?: string;
}

@Component({
	selector: 'app-modal-lookup-swl',
	template: `
		<div mat-dialog-title class="mat-dialog-title">{{ title }}</div>
		<mat-dialog-content class="mat-dialog-content" class="pb-0">
			<div class="fs-6 fw-normal pb-3" *ngIf="subtitle">{{ subtitle }}</div>
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
											<div class="text-data">{{ searchResult.licenceHolderName }}</div>
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
											<div class="text-data fw-bold">{{ searchResult.licenceStatusCode }}</div>
										</div>
									</div>
								</app-alert>
							</div>
						</ng-container>

						<ng-template #IsFoundInvalid>
							<div class="mt-3">
								<app-alert type="warning" icon="">
									<div class="fs-5 mb-2">This licence is not valid Security Worker licence</div>
									<div class="row">
										<div class="col-md-5 col-sm-12">
											<div class="d-block text-muted mt-2">
												{{ searchResult.workerLicenceTypeCode | options : 'WorkerLicenceTypes' }} Number
											</div>
											<div class="text-data">{{ searchResult.licenceNumber }}</div>
										</div>
										<div class="col-md-3 col-sm-12">
											<div class="d-block text-muted mt-2">Expiry Date</div>
											<div class="text-data">{{ searchResult.expiryDate }}</div>
										</div>
										<div class="col-md-4 col-sm-12">
											<div class="d-block text-muted mt-2">Licence Status</div>
											<div class="text-data fw-bold">{{ searchResult.licenceStatusCode }}</div>
										</div>
									</div>
									<div class="mt-2" *ngIf="notValidSwlMessage">
										{{ notValidSwlMessage }}
										<!-- 'Cancel' to exit this dialog and then add them as a member without a security worker licence to
										proceed. -->
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
export class ModalLookupSwlComponent implements OnInit {
	form = this.businessApplicationService.swlLookupLicenceFormGroup;

	title = '';
	subtitle: string | null = null;
	notValidSwlMessage: string | null = null;

	searchResult: any = null;
	isSearchPerformed = false;
	isFoundValid = false;
	isFound = false;

	constructor(
		private dialogRef: MatDialogRef<ModalLookupSwlComponent>,
		private businessApplicationService: BusinessApplicationService,
		private commonApplicationService: CommonApplicationService,
		@Inject(MAT_DIALOG_DATA) public dialogData: LookupSwlDialogData
	) {}

	ngOnInit(): void {
		this.form.reset();

		this.title = this.dialogData.title;
		this.subtitle = this.dialogData.subtitle ?? null;
		this.notValidSwlMessage = this.dialogData.notValidSwlMessage ?? null;
	}

	onSearch(): void {
		this.resetFlags();

		this.form.markAllAsTouched();
		if (!this.form.valid) return;

		this.commonApplicationService
			.getLicenceNumberLookup(this.licenceNumberLookup.value)
			.pipe()
			.subscribe((resp: LicenceLookupResult) => {
				this.isSearchPerformed = true;
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
