import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { BusinessApplicationService } from '../../services/business-application.service';
import { BranchResponse } from './common-business-bc-branches.component';

@Component({
	selector: 'app-member-with-swl-add-modal',
	template: `
		<div mat-dialog-title>Add Member with Security Worker Licence</div>
		<mat-dialog-content>
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-md-6">
						<mat-form-field>
							<mat-label>Lookup a licence number</mat-label>
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
				</div>
			</form>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close class="large" color="primary">Cancel</button>
				</div>
				<div class="offset-md-4 col-md-4 col-sm-12 mb-2">
					<button mat-flat-button color="primary" class="large" (click)="onSave()">Add</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
})
export class MemberWithSwlAddModalComponent implements OnInit {
	form = this.businessApplicationService.memberWithSwlFormGroup;

	phoneMask = SPD_CONSTANTS.phone.displayMask;
	matcher = new FormErrorStateMatcher();

	constructor(
		private dialogRef: MatDialogRef<MemberWithSwlAddModalComponent>,
		private businessApplicationService: BusinessApplicationService,
		@Inject(MAT_DIALOG_DATA) public dialogData: BranchResponse
	) {}

	ngOnInit(): void {
		this.form.reset();
		this.form.patchValue(this.dialogData);
	}

	onSave(): void {
		this.form.markAllAsTouched();
		if (!this.form.valid) return;

		this.dialogRef.close({
			data: this.form.value,
		});
	}
}
