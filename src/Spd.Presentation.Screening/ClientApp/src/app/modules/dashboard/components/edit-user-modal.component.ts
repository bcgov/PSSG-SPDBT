import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';

export interface UserDialogData {
	id: string;
	authorizationTypeCode: string;
	surname: string;
	givenName: string;
	email: string;
}

@Component({
	selector: 'app-edit-user-modal',
	template: `
		<div mat-dialog-title>{{ title }}</div>
		<mat-dialog-content>
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Authorization Type</mat-label>
							<input matInput formControlName="authorizationTypeCode" [errorStateMatcher]="matcher" />
							<mat-error *ngIf="form.get('authorizationTypeCode')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Surname</mat-label>
							<input matInput formControlName="surname" [errorStateMatcher]="matcher" />
							<mat-error *ngIf="form.get('surname')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>

				<div class="row">
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Given Name</mat-label>
							<input matInput formControlName="givenName" [errorStateMatcher]="matcher" />
							<mat-error *ngIf="form.get('givenName')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Email Address</mat-label>
							<input matInput formControlName="email" placeholder="name@domain.com" [errorStateMatcher]="matcher" />
							<mat-error *ngIf="form.get('email')?.hasError('email')"> Must be a valid email address </mat-error>
							<mat-error *ngIf="form.get('email')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>
			</form>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row">
				<div class="col-6">
					<button mat-stroked-button mat-dialog-close color="primary">Cancel</button>
				</div>
				<div class="col-6 me-auto">
					<button mat-raised-button color="primary" (click)="onSave()">Save</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
})
export class EditUserModalComponent {
	title: string = '';
	form: FormGroup = this.formBuilder.group({
		authorizationTypeCode: new FormControl('', [Validators.required]),
		surname: new FormControl('', [Validators.required]),
		givenName: new FormControl('', [Validators.required]),
		email: new FormControl('', [Validators.required, Validators.email]),
	});
	matcher = new FormErrorStateMatcher();

	constructor(
		private formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<EditUserModalComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: UserDialogData
	) {}

	ngOnInit(): void {
		this.form.patchValue(this.dialogData);
		this.title = this.dialogData.id ? 'Edit User' : 'Add User';
	}

	onSave(): void {
		this.form.markAllAsTouched();
		if (this.form.valid) {
			this.dialogRef.close({
				data: this.form.value,
			});
		}
	}
}
