import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LicenceResponse, WorkerLicenceTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { BusinessApplicationService } from '../../services/business-application.service';
import {
	LookupByLicenceNumberDialogData,
	ModalLookupByLicenceNumberComponent,
} from './modal-lookup-by-licence-number.component';

@Component({
	selector: 'app-common-employees',
	template: `
		<mat-accordion multi="false">
			<!-- <ng-container *ngIf="isNewOrRenewal; else isUpdateTitle2"> -->
			<!-- <div class="fs-5 mb-2">Controlling members WITHOUT a security worker licence</div> -->
			<!-- <div class="my-3">
					<app-alert type="info" icon="info">
						Your business must have valid security worker licence holders in B.C. that support the various licence
						categories the business wishes to be licensed for. If your controlling members don't meet this requirement,
						add employees who do.
					</app-alert>
				</div> -->
			<!-- </ng-container>
			<ng-template #isUpdateTitle2>
				<div class="fs-5 mb-2">Employee Updates</div>
				<div>
					If your employees who are licence holders for the business change during the business licence term, update
					their information here.
				</div>
			</ng-template> -->

			<mat-expansion-panel class="mat-expansion-panel-border my-2 w-100" [expanded]="defaultExpanded">
				<mat-expansion-panel-header>
					<mat-panel-title>Employees</mat-panel-title>
				</mat-expansion-panel-header>

				<form [formGroup]="form" novalidate>
					<div class="row mt-4" *ngIf="employeesExist">
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

					<div class="row mt-3">
						<ng-container *ngIf="!employeesExist">
							<div class="mt-2 mb-3">No employees exist</div>
						</ng-container>

						<ng-container *ngIf="isMaxNumberOfEmployees; else CanAddEmployee">
							<app-alert type="warning" icon="warning">
								<div>The maximum number of employees has been reached</div>
							</app-alert>
						</ng-container>
						<ng-template #CanAddEmployee>
							<div class="col-md-12" [ngClass]="isWizard ? 'col-lg-4 col-xl-4' : 'col-lg-6 col-xl-5'">
								<button mat-flat-button color="primary" class="large mb-2" (click)="onAddLicenceHolder()">
									Add Employee
								</button>
							</div>
						</ng-template>
					</div>
				</form>
			</mat-expansion-panel>
		</mat-accordion>
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
export class CommonEmployeesComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	form = this.businessApplicationService.employeesFormGroup;
	controllingMembersFormGroup = this.businessApplicationService.controllingMembersFormGroup;

	@Input() defaultExpanded = false;
	@Input() isWizard = false;

	// @Input() applicationTypeCode!: ApplicationTypeCode;

	// get isNewOrRenewal(): boolean {
	// 	return (
	// 		this.applicationTypeCode === ApplicationTypeCode.Renewal || this.applicationTypeCode === ApplicationTypeCode.New
	// 	);
	// }

	// get isUpdate(): boolean {
	// 	return this.applicationTypeCode === ApplicationTypeCode.Update;
	// }

	dataSource!: MatTableDataSource<any>;
	columns: string[] = ['licenceHolderName', 'licenceNumber', 'licenceStatusCode', 'expiryDate', 'action1'];

	constructor(
		private formBuilder: FormBuilder,
		private dialog: MatDialog,
		private businessApplicationService: BusinessApplicationService
	) {}

	ngOnInit(): void {
		this.dataSource = new MatTableDataSource(this.employeesList.value);
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
					this.employeesList.removeAt(index);
					this.dataSource = new MatTableDataSource(this.employeesList.value);
				}
			});
	}

	onAddLicenceHolder(): void {
		const dialogOptions: LookupByLicenceNumberDialogData = {
			title: 'Add Member with Security Worker Licence',
			lookupWorkerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence,
			isExpiredLicenceSearch: false,
			isLoggedIn: true,
		};
		this.dialog
			.open(ModalLookupByLicenceNumberComponent, {
				width: '800px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				const memberData: LicenceResponse = resp?.data;
				if (memberData) {
					// Manager can't add employee if they are already listed as a member
					const membersWithSwlArray = this.membersWithSwlList.value ?? [];
					const found = membersWithSwlArray.find((item: any) => item.licenceNumber === memberData.licenceNumber);
					if (found) {
						this.employeeAlreadyListed();
						return;
					}

					this.employeesList.push(this.newMemberRow(memberData));
					this.dataSource.data = this.employeesList.value;
				}
			});
	}

	private newMemberRow(memberData: any): FormGroup {
		return this.formBuilder.group({
			bizContactId: [memberData.bizContactId],
			contactId: [memberData.licenceHolderId],
			licenceId: [memberData.licenceId],
			licenceHolderName: [memberData.licenceHolderName],
			licenceNumber: [memberData.licenceNumber],
			licenceStatusCode: [memberData.licenceStatusCode],
			expiryDate: [memberData.expiryDate],
			clearanceStatus: [memberData.clearanceStatus],
		});
	}

	private employeeAlreadyListed(): void {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Warning',
			message: `If your controlling member is also your licence holder, you should not enter them as an employee.`,
			cancelText: 'Ok',
		};

		this.dialog.open(DialogComponent, { data });
	}

	get employeesList(): FormArray {
		return <FormArray>this.form.get('employees');
	}
	get membersWithSwlList(): FormArray {
		return <FormArray>this.controllingMembersFormGroup.get('membersWithSwl');
	}
	get employeesExist(): boolean {
		return this.dataSource.data.length > 0;
	}
	get isMaxNumberOfEmployees(): boolean {
		return this.dataSource.data.length >= SPD_CONSTANTS.maxCount.employees;
	}
}
