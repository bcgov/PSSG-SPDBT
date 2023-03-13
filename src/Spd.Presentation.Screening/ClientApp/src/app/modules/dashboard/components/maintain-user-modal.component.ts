import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { UserModel } from './users.component';

export interface UserDialogData {
	user: UserModel;
}

@Component({
	selector: 'app-maintain-user-modal',
	template: `
		<div mat-dialog-title>{{ title }}</div>
		<mat-dialog-content>
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Authorization Type</mat-label>
							<input matInput formControlName="authorizationType" [errorStateMatcher]="matcher" />
							<mat-error *ngIf="form.get('authorizationType')?.hasError('required')"> This is required </mat-error>
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

				<div class="row" *ngIf="isEdit">
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Phone Number</mat-label>
							<input
								matInput
								formControlName="phoneNumber"
								[mask]="phoneMask"
								[showMaskTyped]="true"
								[errorStateMatcher]="matcher"
							/>
							<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Job Title</mat-label>
							<input matInput formControlName="jobTitle" [errorStateMatcher]="matcher" />
							<mat-error *ngIf="form.get('jobTitle')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>

				<div class="row" *ngIf="isEdit">
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Date of Birth</mat-label>
							<input matInput [matDatepicker]="picker" formControlName="dateOfBirth" [errorStateMatcher]="matcher" />
							<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
							<mat-datepicker #picker startView="multi-year" [startAt]="startAt"></mat-datepicker>
							<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>
			</form>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close color="primary">Cancel</button>
				</div>
				<div class="offset-md-4 col-md-4 col-sm-12 mb-2">
					<button mat-raised-button color="primary" (click)="onSave()">Save</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
})
export class MaintainUserModalComponent {
	phoneMask = SPD_CONSTANTS.phone.displayMask;
	title: string = '';
	isEdit = false;
	form: FormGroup = this.formBuilder.group({
		authorizationType: new FormControl('', [Validators.required]),
		surname: new FormControl('', [Validators.required]),
		givenName: new FormControl('', [Validators.required]),
		email: new FormControl('', [Validators.required, Validators.email]),
		phoneNumber: new FormControl('', [Validators.required]),
		jobTitle: new FormControl('', [Validators.required]),
		dateOfBirth: new FormControl('', [Validators.required]),
	});
	startAt = SPD_CONSTANTS.date.birthDateStartAt;
	matcher = new FormErrorStateMatcher();

	constructor(
		private formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<MaintainUserModalComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: UserDialogData
	) {}

	ngOnInit(): void {
		this.form.patchValue(this.dialogData.user);
		this.isEdit = this.dialogData.user.id ? true : false;
		this.title = this.dialogData.user.id ? 'Edit User' : 'Add User';
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
