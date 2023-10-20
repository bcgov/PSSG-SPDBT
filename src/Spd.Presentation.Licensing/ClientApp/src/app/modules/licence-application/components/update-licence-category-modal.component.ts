import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectOptions, SwlCategoryTypes } from 'src/app/core/code-types/model-desc.models';
import { LicenceApplicationService } from '../licence-application.service';

export interface LicenceCategoryDialogData {}

@Component({
	selector: 'app-update-apply-name-change-modal',
	template: `
		<div mat-dialog-title>
			Add Licence Category
			<mat-divider></mat-divider>
		</div>
		<div mat-dialog-content>
			<div class="row">
				<div class="col-lg-8 col-md-6 col-sm-12">
					<mat-form-field>
						<mat-label>Category</mat-label>
						<mat-select [(ngModel)]="category">
							<mat-option *ngFor="let item of validCategoryList" [value]="item.code">
								{{ item.desc }}
							</mat-option>
						</mat-select>
					</mat-form-field>
					<mat-error class="mat-option-error" *ngIf="isDirtyAndInvalid">
						At least one category must be added
					</mat-error>
				</div>
				<div class="col-lg-4 col-md-6 col-sm-12">
					<button mat-stroked-button color="primary" class="large mb-3" (click)="onAddCategory()">Add Category</button>
				</div>
			</div>

			<!-- <app-licence-category-private-investigator></app-licence-category-private-investigator> -->
		</div>
		<div mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-lg-3 col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close class="large" color="primary">Cancel</button>
				</div>
				<div class="offset-lg-6 col-lg-3 offset-md-4 col-md-4 col-sm-12 mb-2">
					<button mat-flat-button color="primary" class="large" (click)="onSave()">Save</button>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class UpdateLicenceCategoryModalComponent implements OnInit {
	category = '';
	isDirtyAndInvalid = false;

	validCategoryList: SelectOptions[] = SwlCategoryTypes;
	// categoryPrivateInvestigatorFormGroup = this.licenceApplicationService.categoryPrivateInvestigatorFormGroup;

	constructor(
		private dialogRef: MatDialogRef<UpdateLicenceCategoryModalComponent>,
		private licenceApplicationService: LicenceApplicationService,
		@Inject(MAT_DIALOG_DATA) public dialogData: LicenceCategoryDialogData
	) {}

	ngOnInit(): void {
		// this.categoryPrivateInvestigatorFormGroup.patchValue({ isInclude: true });
	}

	onAddCategory() {}

	onSave() {
		// this.categoryPrivateInvestigatorFormGroup.markAllAsTouched();
		// console.log('xxx', this.categoryPrivateInvestigatorFormGroup.valid);
		// console.log('xxx', this.categoryPrivateInvestigatorFormGroup.value);
		// if (!this.categoryPrivateInvestigatorFormGroup.valid) return;

		this.dialogRef.close({ success: true });
	}
}
