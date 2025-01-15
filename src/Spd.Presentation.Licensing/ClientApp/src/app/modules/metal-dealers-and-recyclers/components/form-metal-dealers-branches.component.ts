import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import {
	MetalDealersAndRecyclersBranchResponse,
	ModalMetalDealersBranchComponent,
} from './modal-metal-dealers-branch.component';

@Component({
	selector: 'app-form-metal-dealers-branches',
	template: `
		<div class="row">
			<div class="col-lg-12 col-md-12 col-sm-12 mx-auto" [ngClass]="isReadonly ? 'col-xl-12' : 'col-xl-11'">
				<ng-container *ngIf="branchesExist">
					<mat-table [dataSource]="dataSource" [ngClass]="isReadonly ? '' : 'detail-table'">
						<ng-container matColumnDef="addressLine1">
							<mat-header-cell class="text-minor-heading-small" *matHeaderCellDef>Address Line 1</mat-header-cell>
							<mat-cell *matCellDef="let branch">
								<span class="mobile-label">Address Line 1:</span>
								{{ branch.addressLine1 | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="city">
							<mat-header-cell class="text-minor-heading-small" *matHeaderCellDef>City</mat-header-cell>
							<mat-cell *matCellDef="let branch">
								<span class="mobile-label">City:</span>
								{{ branch.city | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="branchManager">
							<mat-header-cell class="text-minor-heading-small" *matHeaderCellDef>Manager</mat-header-cell>
							<mat-cell *matCellDef="let branch">
								<span class="mobile-label">Manager:</span>
								{{ branch | fullname | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action1">
							<mat-header-cell class="text-minor-heading-small" *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let branch">
								<button
									mat-flat-button
									class="table-button w-auto"
									style="color: var(--color-green);"
									aria-label="Edit branch"
									(click)="onEditBranch(branch)"
								>
									<mat-icon>edit</mat-icon>Edit
								</button>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action2">
							<mat-header-cell class="text-minor-heading-small" *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let branch; let i = index">
								<button
									mat-flat-button
									class="table-button w-auto"
									style="color: var(--color-red);"
									aria-label="Remove branch"
									(click)="onRemoveBranch(i)"
								>
									<mat-icon>delete_outline</mat-icon>Remove
								</button>
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
						<mat-row class="mat-data-row" *matRowDef="let row; columns: columns"></mat-row>
					</mat-table>
				</ng-container>

				<div class="text-center" *ngIf="!isReadonly">
					<button mat-stroked-button (click)="onAddBranch()" class="large mt-3 w-auto">
						<mat-icon class="add-icon">add_circle</mat-icon>Add Branch
					</button>

					<div class="mt-3" *ngIf="(form.dirty || form.touched) && form.invalid && form.hasError('branchrequired')">
						<mat-error class="mat-option-error">At least one branch is required</mat-error>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.detail-table {
				background-color: #f6f6f6 !important;
			}

			.mat-column-action1 {
				min-width: 150px;
				max-width: 150px;
				.table-button {
					min-width: 130px;
				}
			}

			.mat-column-action2 {
				min-width: 150px;
				max-width: 150px;
				.table-button {
					min-width: 130px;
				}
			}
		`,
	],
	standalone: false,
})
export class FormMetalDealersBranchesComponent implements OnInit, LicenceChildStepperStepComponent {
	branchesExist = false;

	dataSource!: MatTableDataSource<MetalDealersAndRecyclersBranchResponse>;
	columns!: string[];

	@Input() form!: FormGroup;
	@Input() isReadonly!: boolean;

	constructor(
		private formBuilder: FormBuilder,
		private dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.dataSource = new MatTableDataSource(this.branchesArray.value);
		this.branchesExist = this.dataSource.data.length > 0;

		if (this.isReadonly) {
			this.columns = ['addressLine1', 'city', 'branchManager'];
		} else {
			this.columns = ['addressLine1', 'city', 'branchManager', 'action1', 'action2'];
		}
	}

	onEditBranch(branch: MetalDealersAndRecyclersBranchResponse): void {
		this.branchDialog(branch, false);
	}

	onRemoveBranch(index: number) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this branch?',
			actionText: 'Remove',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.branchesArray.removeAt(index);
					this.dataSource = new MatTableDataSource(this.branchesArray.value);
					this.branchesExist = this.dataSource.data.length > 0;
				}
			});
	}

	onAddBranch(): void {
		this.branchDialog({}, true);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	private branchDialog(dialogOptions: MetalDealersAndRecyclersBranchResponse, isCreate: boolean): void {
		dialogOptions.isCreate = isCreate;

		this.dialog
			.open(ModalMetalDealersBranchComponent, {
				width: '1200px',
				data: dialogOptions,
				autoFocus: true,
			})
			.afterClosed()
			.subscribe((resp) => {
				const branchData = resp?.data;
				if (branchData) {
					if (isCreate) {
						this.branchesArray.push(this.newBranchRow(branchData));
					} else {
						const branchIndex = this.branchesArray.value.findIndex(
							(item: any) => item.branchId == dialogOptions.branchId!
						);
						this.patchBranchData(branchIndex, branchData);
					}

					this.dataSource.data = this.branchesArray.value;
					this.branchesExist = this.dataSource.data.length > 0;
				}
			});
	}

	private newBranchRow(branchData: any): FormGroup {
		return this.formBuilder.group({
			addressLine1: [branchData.addressLine1],
			addressLine2: [branchData.addressLine2],
			city: [branchData.city],
			postalCode: [branchData.postalCode],
			province: [branchData.province],
			country: [branchData.country],
			givenName: [branchData.givenName],
			middleName: [branchData.middleName],
			surname: [branchData.surname],
			phoneNumber: [branchData.phoneNumber],
			emailAddress: [branchData.emailAddress],
		});
	}

	private patchBranchData(branchIndex: number, branchData: any) {
		if (branchIndex < 0) {
			return;
		}

		this.branchesArray.at(branchIndex).patchValue({
			addressLine1: branchData.addressLine1,
			addressLine2: branchData.addressLine2,
			city: branchData.city,
			postalCode: branchData.postalCode,
			province: branchData.province,
			country: branchData.country,
			givenName: branchData.givenName,
			middleName: branchData.middleName,
			surname: branchData.surname,
			phoneNumber: branchData.phoneNumber,
			emailAddress: branchData.emailAddress,
		});
	}

	get branchesArray(): FormArray {
		return <FormArray>this.form.get('branches');
	}
}
