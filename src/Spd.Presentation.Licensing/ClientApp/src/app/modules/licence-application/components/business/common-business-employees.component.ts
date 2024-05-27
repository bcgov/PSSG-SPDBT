import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { UtilService } from '@app/core/services/util.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { HotToastService } from '@ngneat/hot-toast';
import { LookupSwlDialogData, ModalLookupSwlComponent } from './modal-lookup-swl.component';

@Component({
	selector: 'app-common-business-employees',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row mt-4" *ngIf="dataSource.data.length > 0">
				<div class="col-12">
					<mat-table [dataSource]="dataSource">
						<ng-container matColumnDef="licenceHolderName">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Full Name</mat-header-cell>
							<mat-cell *matCellDef="let member">
								<span class="mobile-label">Full Name:</span>
								{{ member.licenceHolderName | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="licenceNumber">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>
								Security Worker Licence Number
							</mat-header-cell>
							<mat-cell *matCellDef="let member">
								<span class="mobile-label">Security Worker Licence Number:</span>
								{{ member.licenceNumber | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="licenceStatusCode">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Licence Status</mat-header-cell>
							<mat-cell *matCellDef="let member">
								<span class="mobile-label">Status:</span>
								{{ member.licenceStatusCode | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="expiryDate">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Expiry Date</mat-header-cell>
							<mat-cell *matCellDef="let member">
								<span class="mobile-label">Expiry Date:</span>
								{{ member.expiryDate | formatDate | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action1">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let member; let i = index">
								<button
									mat-flat-button
									class="table-button w-auto"
									style="color: var(--color-red);"
									aria-label="Remove controlling member"
									(click)="onRemoveEmployee(i)"
								>
									<mat-icon>delete_outline</mat-icon>Remove
								</button>
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
						<mat-row class="mat-data-row" *matRowDef="let row; columns: columns"></mat-row>
					</mat-table>
				</div>
			</div>

			<div class="row">
				<div class="col-xl-5 col-lg-6 col-md-12">
					<button mat-flat-button color="primary" class="large mt-4 mb-2" (click)="onAddLicenceHolder()">
						Add Employee
					</button>
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
		`,
	],
})
export class CommonBusinessEmployeesComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	@Input() form!: FormGroup;

	employeesList: Array<any> = [];

	dataSource!: MatTableDataSource<any>;
	columns: string[] = ['licenceHolderName', 'licenceNumber', 'licenceStatusCode', 'expiryDate', 'action1'];

	constructor(private dialog: MatDialog, private utilService: UtilService, private hotToastService: HotToastService) {}

	ngOnInit(): void {
		this.employeesList = this.employeesArray.value;
		this.dataSource = new MatTableDataSource(this.employeesList);
		this.updateAndSortData();
	}

	isFormValid(): boolean {
		return true;
	}

	onRemoveEmployee(index: number) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this employee?',
			actionText: 'Yes, remove',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.employeesList.splice(index, 1);
					this.dataSource = new MatTableDataSource(this.employeesList);
				}
			});
	}

	onAddLicenceHolder(): void {
		const dialogOptions: LookupSwlDialogData = {
			title: 'Add Member with Security Worker Licence',
		};
		this.dialog
			.open(ModalLookupSwlComponent, {
				width: '800px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				if (resp) {
					this.employeesList.push(resp.data);
					this.hotToastService.success('Employee was successfully added');
					this.updateAndSortData();
				}
			});
	}

	private updateAndSortData() {
		this.employeesList = [...this.employeesList].sort((a, b) => {
			return this.utilService.sortByDirection(a.licenceHolderName, b.licenceHolderName, 'asc');
		});
		this.dataSource.data = this.employeesList;
	}

	get employeesArray(): FormArray {
		return <FormArray>this.form.get('employees');
	}
}
