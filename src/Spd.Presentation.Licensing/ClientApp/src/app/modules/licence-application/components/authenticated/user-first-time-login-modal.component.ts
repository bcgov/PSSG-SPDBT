import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

// export interface UpdatePhotoDialogData {}

@Component({
	selector: 'app-user-first-time-login-modal',
	template: `
		<div mat-dialog-title>
			First Time Login
			<mat-divider class="mat-divider-main mt-2 mb-3"></mat-divider>
		</div>
		<div mat-dialog-content>
			<div class="fs-5">We found existing records in our system with your name and date of birth</div>
			<div class="mt-3">Select one to link to your portal account:</div>
			<div class="row">
				<ng-container *ngFor="let option of options; let i = index">
					<div class="col-lg-4 col-md-6 col-sm-12 mt-2">
						<div
							tabindex="0"
							class="user-option p-3"
							(click)="onDataChange(option.id)"
							(keydown)="onKeyDown($event, option.id)"
							[ngClass]="{ 'active-selection-border': userOption === option.id }"
						>
							<div class="text-label d-block text-muted">Name</div>
							<div class="summary-text-data">{{ option.name }}</div>
							<div class="text-label d-block text-muted">Date of Birth</div>
							<div class="summary-text-data">
								{{ option.dateOfBirth | formatDate : constants.date.formalDateFormat }}
							</div>
							<div class="text-label d-block text-muted">Licence Number</div>
							<div class="summary-text-data">{{ option.licenceNumber }}</div>
							<div class="text-label d-block text-muted">Expiry Date</div>
							<div class="summary-text-data">
								{{ option.expiryDate | formatDate : constants.date.formalDateFormat }}
							</div>
						</div>
					</div>
				</ng-container>
			</div>
		</div>
		<div mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-lg-3 col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close class="large" color="primary">Cancel</button>
				</div>
				<div class="offset-lg-6 col-lg-3 offset-md-4 col-md-4 col-sm-12 mb-2">
					<button mat-flat-button color="primary" class="large" (click)="onNext()">Next</button>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.user-option {
				border-radius: 4px;
				border: 1px solid grey;
				box-shadow: 0 3px 1px -2px #0003, 0 2px 2px #00000024, 0 1px 5px #0000001f;
			}
		`,
	],
})
export class UserFirstTimeLoginModalComponent {
	constants = SPD_CONSTANTS;
	userOption = '';

	options: Array<any> = [
		{
			id: '1',
			name: 'Joanna Anne Smith',
			dateOfBirth: '1991-08-15',
			licenceNumber: 'E1139967',
			expiryDate: '2015-08-15',
		},
		{
			id: '2',
			name: 'Joanna Rachel Smith',
			dateOfBirth: '1991-08-15',
			licenceNumber: 'E2239967',
			expiryDate: '2026-04-22',
		},
		{
			id: '3',
			name: 'Joanna Smith',
			dateOfBirth: '1991-08-15',
			licenceNumber: 'E4439967',
			expiryDate: '2030-11-05',
		},
	];

	constructor(
		private dialogRef: MatDialogRef<UserFirstTimeLoginModalComponent> // @Inject(MAT_DIALOG_DATA) public dialogData: UpdatePhotoDialogData
	) {}

	onNext(): void {
		this.dialogRef.close({ success: true });
	}

	onDataChange(_val: string) {
		this.userOption = _val;
	}

	onKeyDown(event: KeyboardEvent, _val: string) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onDataChange(_val);
	}
}
