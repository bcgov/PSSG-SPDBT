import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngxpert/hot-toast';
import { DelegateResponse } from 'src/app/api/models';
import { DelegateService } from 'src/app/api/services';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';

export interface DelegateDialogData {
	orgId: string;
	applicationId: string;
}

@Component({
	selector: 'app-delegate-add-modal',
	template: `
		<div mat-dialog-title>Add Delegate</div>
		<mat-dialog-content>
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-6">
						<mat-form-field>
							<mat-label>Given Name</mat-label>
							<input matInput formControlName="firstName" maxlength="40" />
							<mat-error *ngIf="form.get('firstName')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
					<div class="col-6">
						<mat-form-field>
							<mat-label>Surname</mat-label>
							<input matInput formControlName="lastName" maxlength="40" />
							<mat-error *ngIf="form.get('lastName')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<mat-form-field>
							<mat-label>Email</mat-label>
							<input matInput formControlName="emailaddress" placeholder="name@domain.com" maxlength="75" />
							<mat-error *ngIf="form.get('emailaddress')?.hasError('required')">This is required</mat-error>
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
export class DelegateAddModalComponent {
	form: FormGroup = this.formBuilder.group({
		lastName: new FormControl('', [FormControlValidators.required]),
		firstName: new FormControl('', [FormControlValidators.required]),
		emailaddress: new FormControl('', [Validators.required]), // SPDBT-2951 remove FormControlValidators.govEmail
	});

	constructor(
		private delegateService: DelegateService,
		private formBuilder: FormBuilder,
		private hotToast: HotToastService,
		private dialogRef: MatDialogRef<DelegateAddModalComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: DelegateDialogData
	) {}

	onSave(): void {
		this.form.markAllAsTouched();

		if (!this.form.valid) {
			return;
		}

		const body: DelegateResponse = { ...this.form.value };

		this.delegateService
			.apiOrgsOrgIdApplicationApplicationIdDelegatePost({
				applicationId: this.dialogData.applicationId,
				orgId: this.dialogData.orgId,
				body,
			})
			.pipe()
			.subscribe(() => {
				this.hotToast.success('Delegate was successfully added');
				this.dialogRef.close({
					data: '',
				});
			});
	}
}
