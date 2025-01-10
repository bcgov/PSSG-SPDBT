import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import {
	MetalDealersAndRecyclersBranchResponse,
	ModalMetalDealersBranchComponent,
} from './modal-metal-dealers-branch.component';

@Component({
	selector: 'app-step-metal-dealers-branches',
	template: `
		<app-step-section title="Branch Offices" subtitle="Click on the 'Add Branch' button to add your branch offices.">
			<div class="row">
				<div class="col-xl-11 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<mat-table [dataSource]="dataSource">
						<ng-container matColumnDef="addressLine1">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Address Line 1</mat-header-cell>
							<mat-cell *matCellDef="let branch">
								<span class="mobile-label">Address Line 1:</span>
								{{ branch.addressLine1 | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="city">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>City</mat-header-cell>
							<mat-cell *matCellDef="let branch">
								<span class="mobile-label">City:</span>
								{{ branch.city | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="branchManager">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Manager</mat-header-cell>
							<mat-cell *matCellDef="let branch">
								<span class="mobile-label">Manager:</span>
								{{ branch | fullname | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action1">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
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
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
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

					<ng-container *ngIf="!branchesExist">
						<div class="fs-5 my-3">No branches have been entered</div>
					</ng-container>

					<button mat-stroked-button (click)="onAddBranch()" class="large mt-3 w-auto">
						<mat-icon class="add-icon">add_circle</mat-icon>Add Branch
					</button>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [
		`
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
export class StepMetalDealersBranchesComponent implements OnInit {
	branchesExist = false;

	dataSource!: MatTableDataSource<MetalDealersAndRecyclersBranchResponse>;
	columns: string[] = ['addressLine1', 'city', 'branchManager', 'action1', 'action2'];

	form = this.metalDealersApplicationService.branchesFormGroup;

	constructor(
		private metalDealersApplicationService: MetalDealersApplicationService,
		private formBuilder: FormBuilder,
		private dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.dataSource = new MatTableDataSource(this.branchesArray.value);
		this.branchesExist = this.dataSource.data.length > 0;
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

	private branchDialog(dialogOptions: MetalDealersAndRecyclersBranchResponse, isCreate: boolean): void {
		dialogOptions.isCreate = isCreate;

		this.dialog
			.open(ModalMetalDealersBranchComponent, {
				width: '1000px',
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
