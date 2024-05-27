import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LicenceResponse } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { LookupSwlDialogData, ModalLookupSwlComponent } from './modal-lookup-swl.component';
import { ModalMemberWithoutSwlEditComponent } from './modal-member-without-swl-edit.component';

@Component({
	selector: 'app-common-business-controlling-members',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row mt-4" *ngIf="dataSourceWithSWL.data.length > 0">
				<div class="col-12">
					<mat-table [dataSource]="dataSourceWithSWL">
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
									(click)="onRemoveMember(true, i)"
								>
									<mat-icon>delete_outline</mat-icon>Remove
								</button>
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columnsWithSWL; sticky: true"></mat-header-row>
						<mat-row class="mat-data-row" *matRowDef="let row; columns: columnsWithSWL"></mat-row>
					</mat-table>
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-xl-5 col-lg-6 col-md-12">
					<button mat-flat-button color="primary" class="large mb-2" (click)="onAddMemberWithSWL()">
						Add Member with Security Worker Licence
					</button>
				</div>
			</div>

			<div class="row mt-4" *ngIf="dataSourceWithoutSWL.data.length > 0">
				<div class="col-12">
					<mat-table [dataSource]="dataSourceWithoutSWL">
						<ng-container matColumnDef="licenceHolderName">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Full Name</mat-header-cell>
							<mat-cell *matCellDef="let member">
								<span class="mobile-label">Full Name:</span>
								{{ member.licenceHolderName | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="clearanceStatus">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>
								Controlling Member Clearance
							</mat-header-cell>
							<mat-cell *matCellDef="let member">
								<span class="mobile-label">Controlling Member Clearance:</span>
								{{ member.clearanceStatus | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action1">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let member">
								<button
									mat-flat-button
									class="table-button"
									style="color: var(--color-green);"
									aria-label="Edit controlling member"
									(click)="onEditMemberWithoutSWL(member)"
									*ngIf="!member.licenceNumber"
								>
									<mat-icon>edit</mat-icon>Edit
								</button>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action2">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let member; let i = index">
								<button
									mat-flat-button
									class="table-button w-auto"
									style="color: var(--color-red);"
									aria-label="Remove controlling member"
									(click)="onRemoveMember(false, i)"
								>
									<mat-icon>delete_outline</mat-icon>Remove
								</button>
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columnsWithoutSWL; sticky: true"></mat-header-row>
						<mat-row class="mat-data-row" *matRowDef="let row; columns: columnsWithoutSWL"></mat-row>
					</mat-table>
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-xl-5 col-lg-6 col-md-12">
					<button mat-flat-button color="primary" class="large mb-2" (click)="onAddMemberWithoutSWL()">
						Add Member without Security Worker Licence
					</button>
				</div>
			</div>

			<div *ngIf="isDocumentNeeded">documentNeeded</div>
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
})
export class CommonBusinessControllingMembersComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	@Input() form!: FormGroup;

	isDocumentNeeded = false;

	dataSourceWithSWL!: MatTableDataSource<any>;
	columnsWithSWL: string[] = ['licenceHolderName', 'licenceNumber', 'licenceStatusCode', 'expiryDate', 'action1'];

	dataSourceWithoutSWL!: MatTableDataSource<any>;
	columnsWithoutSWL: string[] = ['licenceHolderName', 'clearanceStatus', 'action1', 'action2'];

	constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {}

	ngOnInit(): void {
		this.dataSourceWithSWL = new MatTableDataSource(this.membersWithSwlList.value);
		this.dataSourceWithoutSWL = new MatTableDataSource(this.membersWithoutSwlList.value);
	}

	isFormValid(): boolean {
		return true;
	}

	onRemoveMember(isWithSwl: boolean, index: number) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this member?',
			actionText: 'Yes, remove',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					if (isWithSwl) {
						this.membersWithSwlList.removeAt(index);
						this.dataSourceWithSWL = new MatTableDataSource(this.membersWithSwlList.value);
					} else {
						this.membersWithoutSwlList.removeAt(index);
						this.dataSourceWithoutSWL = new MatTableDataSource(this.membersWithoutSwlList.value);
					}
				}
			});
	}

	onAddMemberWithSWL(): void {
		const dialogOptions: LookupSwlDialogData = {
			title: 'Add Member with Security Worker Licence',
			notValidSwlMessage: `'Cancel' to exit this dialog and then add them as a member without a security worker licence to proceed.`,
		};
		this.dialog
			.open(ModalLookupSwlComponent, {
				width: '800px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				const memberData: LicenceResponse = resp?.data;
				if (memberData) {
					this.membersWithSwlList.push(this.newMemberRow(memberData));
					this.dataSourceWithSWL.data = this.membersWithSwlList.value;
				}
			});
	}

	onEditMemberWithoutSWL(member: any): void {
		this.memberDialog(member, false);
	}

	onAddMemberWithoutSWL(): void {
		this.memberDialog({}, true);
	}

	private memberDialog(dialogOptions: any, isCreate: boolean): void {
		this.dialog
			.open(ModalMemberWithoutSwlEditComponent, {
				width: '800px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				const memberData = resp?.data;
				if (memberData) {
					if (isCreate) {
						this.membersWithoutSwlList.push(this.newMemberRow(memberData));
					} else {
						const memberIndex = this.membersWithoutSwlList.value.findIndex(
							(item: any) => item.bizContactId == dialogOptions.id!
						);
						this.patchMemberData(memberIndex, memberData);
					}

					this.dataSourceWithoutSWL.data = this.membersWithoutSwlList.value;
				}
			});
	}

	private newMemberRow(memberData: any): FormGroup {
		return this.formBuilder.group({
			licenceHolderName: [memberData.licenceHolderName ?? `${memberData.givenName} ${memberData.surname}`],
			bizContactId: null,
			contactId: [memberData.licenceHolderId],
			givenName: [memberData.givenName],
			middleName1: [memberData.middleName1],
			middleName2: [memberData.middleName2],
			surname: [memberData.surname],
			emailAddress: [memberData.emailAddress],
			noEmailAddress: [memberData.noEmailAddress],
			phoneNumber: [memberData.phoneNumber],
			licenceId: [memberData.licenceId],
			licenceNumber: [memberData.licenceNumber],
			licenceStatusCode: [memberData.licenceStatusCode],
			licenceTermCode: [memberData.licenceTermCode],
			expiryDate: [memberData.expiryDate],
			clearanceStatus: [memberData.clearanceStatus],
		});
	}

	private patchMemberData(memberIndex: number, memberData: any) {
		if (memberIndex < 0) {
			return;
		}

		this.membersWithoutSwlList.at(memberIndex).patchValue({
			licenceHolderName: memberData.licenceHolderName ?? `${memberData.givenName} ${memberData.surname}`,
			bizContactId: memberData.bizContactId,
			givenName: memberData.givenName,
			middleName1: memberData.middleName1,
			middleName2: memberData.middleName2,
			surname: memberData.surname,
			emailAddress: memberData.emailAddress,
			noEmailAddress: memberData.noEmailAddress,
			licenceId: memberData.licenceId,
			licenceNumber: memberData.licenceNumber,
			licenceStatusCode: memberData.licenceStatusCode,
			licenceTermCode: memberData.licenceTermCode,
			expiryDate: memberData.expiryDate,
			clearanceStatus: memberData.clearanceStatus,
		});
	}

	get membersWithSwlList(): FormArray {
		return <FormArray>this.form.get('membersWithSwl');
	}
	get membersWithoutSwlList(): FormArray {
		return <FormArray>this.form.get('membersWithoutSwl');
	}
}
