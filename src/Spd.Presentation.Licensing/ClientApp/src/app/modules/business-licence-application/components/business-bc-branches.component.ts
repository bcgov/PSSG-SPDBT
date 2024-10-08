import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { ModalBcBranchEditComponent } from './modal-bc-branch-edit.component';

export interface BranchResponse {
	isCreate?: null | boolean;
	branchId?: null | number;
	addressSelected?: null | boolean;
	addressLine1?: null | string;
	addressLine2?: null | string;
	city?: null | string;
	country?: null | string;
	postalCode?: null | string;
	province?: null | string;
	branchManager?: null | string;
	branchPhoneNumber?: null | string;
	branchEmailAddr?: null | string;
}

@Component({
	selector: 'app-business-bc-branches',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="py-2">Does your business have any branches in B.C.?</div>
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12">
					<mat-radio-group aria-label="Select an option" formControlName="hasBranchesInBc">
						<div class="d-flex justify-content-start">
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</div>
					</mat-radio-group>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('hasBranchesInBc')?.dirty || form.get('hasBranchesInBc')?.touched) &&
							form.get('hasBranchesInBc')?.invalid &&
							form.get('hasBranchesInBc')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>

			<div *ngIf="hasBranchesInBc.value === booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
				<div class="row my-2">
					<div class="col-12">
						<div class="mt-3 text-primary-color">The branches in B.C. where licenced employees work:</div>
						<mat-table [dataSource]="dataSource">
							<ng-container matColumnDef="addressLine1">
								<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Address Line 1</mat-header-cell>
								<mat-cell *matCellDef="let branch">
									<span class="mobile-label">Address Line 1:</span>
									{{ branch.addressLine1 | default }}
								</mat-cell>
							</ng-container>

							<ng-container matColumnDef="city">
								<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef sortActionDescription="Sort by city"
									>City</mat-header-cell
								>
								<mat-cell *matCellDef="let branch">
									<span class="mobile-label">City:</span>
									{{ branch.city | default }}
								</mat-cell>
							</ng-container>

							<ng-container matColumnDef="branchManager">
								<mat-header-cell
									class="mat-table-header-cell"
									*matHeaderCellDef
									sortActionDescription="Sort by manager name"
									>Manager</mat-header-cell
								>
								<mat-cell *matCellDef="let branch">
									<span class="mobile-label">Manager:</span>
									{{ branch.branchManager | default }}
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
										*ngIf="!isReadonly"
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
										*ngIf="!isReadonly"
									>
										<mat-icon>delete_outline</mat-icon>Remove
									</button>
								</mat-cell>
							</ng-container>

							<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
							<mat-row class="mat-data-row" *matRowDef="let row; columns: columns"></mat-row>
						</mat-table>

						<button mat-stroked-button (click)="onAddBranch()" class="large mt-3 w-auto" *ngIf="!isReadonly">
							<mat-icon class="add-icon">add_circle</mat-icon>Add Branch
						</button>
					</div>
				</div>
			</div>
		</form>
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
	animations: [showHideTriggerSlideAnimation],
})
export class BusinessBcBranchesComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	dataSource!: MatTableDataSource<BranchResponse>;
	columns: string[] = ['addressLine1', 'city', 'branchManager', 'action1', 'action2'];

	@Input() form!: FormGroup;
	@Input() isReadonly!: boolean;

	constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {}

	ngOnInit(): void {
		this.dataSource = new MatTableDataSource(this.branchesArray.value);

		if (this.isReadonly) {
			this.hasBranchesInBc.disable({ emitEvent: false });
		} else {
			this.hasBranchesInBc.enable();
		}
	}

	onHasBranchesInBcChange(): void {
		if (this.form.value.hasBranchesInBc != BooleanTypeCode.Yes) {
			const branchesArray = this.branchesArray;
			while (branchesArray.length) {
				branchesArray.removeAt(0);
			}
			this.form.setControl('branches', branchesArray);
		}
	}

	isFormValid(): boolean {
		return true;
	}

	onEditBranch(branch: BranchResponse): void {
		this.branchDialog(branch, false);
	}

	onRemoveBranch(index: number) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this branch?',
			actionText: 'Yes, remove',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.branchesArray.removeAt(index);
					this.dataSource = new MatTableDataSource(this.branchesArray.value);
				}
			});
	}

	onAddBranch(): void {
		this.branchDialog({}, true);
	}

	private branchDialog(dialogOptions: BranchResponse, isCreate: boolean): void {
		dialogOptions.isCreate = isCreate;

		this.dialog
			.open(ModalBcBranchEditComponent, {
				width: '800px',
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
			branchManager: [branchData.branchManager],
			branchPhoneNumber: [branchData.branchPhoneNumber],
			branchEmailAddr: [branchData.branchEmailAddr],
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
			branchManager: branchData.branchManager,
			branchPhoneNumber: branchData.branchPhoneNumber,
			branchEmailAddr: branchData.branchEmailAddr,
		});
	}

	get hasBranchesInBc(): FormControl {
		return this.form.get('hasBranchesInBc') as FormControl;
	}
	get branchesArray(): FormArray {
		return <FormArray>this.form.get('branches');
	}
}
