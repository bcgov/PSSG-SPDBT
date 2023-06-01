import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';

@Component({
	selector: 'app-delegate-add-modal',
	template: `
		<div mat-dialog-title>Add Delegate</div>
		<mat-dialog-content>
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-md-4">
						<mat-form-field>
							<mat-label>Given Name</mat-label>
							<input matInput formControlName="firstName" maxlength="40" />
							<mat-error *ngIf="form.get('firstName')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-4">
						<mat-form-field>
							<mat-label>Surname</mat-label>
							<input matInput formControlName="lastName" maxlength="40" />
							<mat-error *ngIf="form.get('lastName')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-4">
						<mat-form-field>
							<mat-label>Email Address</mat-label>
							<input matInput formControlName="email" placeholder="name@domain.com" maxlength="75" />
							<mat-error *ngIf="form.get('email')?.hasError('email')"> Must be a valid email address </mat-error>
							<mat-error *ngIf="form.get('email')?.hasError('required')">This is required</mat-error>
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
		lastName: new FormControl('', [Validators.required]),
		firstName: new FormControl('', [Validators.required]),
		email: new FormControl('', [Validators.required, FormControlValidators.email]),
	});

	constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<DelegateAddModalComponent>) {}

	onSave(): void {
		this.dialogRef.close({
			data: '',
		});
	}
}
