import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-modal-member-without-swl-edit',
	template: `
		<div mat-dialog-title class="mat-dialog-title">{{ title }}</div>
		<mat-dialog-content class="mat-dialog-content">
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
					<div class="col-12 mt-3" *ngIf="noEmailAddress.value" @showHideTriggerSlideAnimation>
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
					<button mat-flat-button color="primary" class="large" (click)="onSave()">
						<span *ngIf="!isEdit">Add</span>
						<span *ngIf="isEdit">Update</span>
					</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class ModalMemberWithoutSwlEditComponent implements OnInit {
	title = '';
	isEdit = false;

	form = this.businessApplicationService.memberWithoutSwlFormGroup;

	phoneMask = SPD_CONSTANTS.phone.displayMask;
	matcher = new FormErrorStateMatcher();

	constructor(
		private dialogRef: MatDialogRef<ModalMemberWithoutSwlEditComponent>,
		private businessApplicationService: BusinessApplicationService,
		@Inject(MAT_DIALOG_DATA) public dialogData: any
	) {}

	ngOnInit(): void {
		this.form.reset();
		this.form.patchValue(this.dialogData);
		this.isEdit = !!this.dialogData.bizContactId;
		this.title = this.isEdit
			? 'Edit Member without Security Worker Licence'
			: 'Add Member without Security Worker Licence';
	}

	onSave(): void {
		this.form.markAllAsTouched();
		if (!this.form.valid) return;

		const formValue = this.form.value;
		if (this.noEmailAddress.value) {
			formValue.emailAddress = null;
		}

		this.dialogRef.close({
			data: formValue,
		});
	}

	get noEmailAddress(): FormControl {
		return this.form.get('noEmailAddress') as FormControl;
	}
}
