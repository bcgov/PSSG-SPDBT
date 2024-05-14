import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { UtilService } from '@app/core/services/util.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { HotToastService } from '@ngneat/hot-toast';
import { ModalMemberWithSwlAddComponent } from './modal-member-with-swl-add.component';
import { ModalMemberWithoutSwlEditComponent } from './modal-member-without-swl-edit.component';

@Component({
	selector: 'app-common-business-controlling-members',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row mt-4" *ngIf="dataSource.data.length > 0">
				<div class="col-12">
					<mat-table [dataSource]="dataSource">
						<ng-container matColumnDef="licenceHolderName">
							<mat-header-cell *matHeaderCellDef>Full Name</mat-header-cell>
							<mat-cell *matCellDef="let member">
								<span class="mobile-label">Full Name:</span>
								{{ member.licenceHolderName | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="licenceNumber">
							<mat-header-cell *matHeaderCellDef>Security Worker Licence Number</mat-header-cell>
							<mat-cell *matCellDef="let member">
								<span class="mobile-label">Security Worker Licence Number:</span>
								{{ member.licenceNumber | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="licenceStatusCode">
							<mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
							<mat-cell *matCellDef="let member">
								<span class="mobile-label">Status:</span>
								{{ member.licenceStatusCode | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="expiryDate">
							<mat-header-cell *matHeaderCellDef>Expiry Date</mat-header-cell>
							<mat-cell *matCellDef="let member">
								<span class="mobile-label">Expiry Date:</span>
								{{ member.expiryDate | formatDate | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="clearanceStatus">
							<mat-header-cell *matHeaderCellDef>Controlling Member Clearance</mat-header-cell>
							<mat-cell *matCellDef="let member">
								<span class="mobile-label">Controlling Member Clearance:</span>
								{{ member.clearanceStatus | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action1">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
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
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let member; let i = index">
								<button
									mat-flat-button
									class="table-button w-auto"
									style="color: var(--color-red);"
									aria-label="Remove controlling member"
									(click)="onRemoveMember(i)"
								>
									<mat-icon>delete_outline</mat-icon>Remove
								</button>
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
						<mat-row *matRowDef="let row; columns: columns"></mat-row>
					</mat-table>
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-lg-6 col-md-12">
					<button mat-flat-button color="primary" class="large mb-2" (click)="onAddMemberWithSWL()">
						Add Member with Security Worker Licence
					</button>
				</div>
				<div class="col-lg-6 col-md-12">
					<button mat-flat-button color="primary" class="large mb-2" (click)="onAddMemberWithoutSWL()">
						Add Member without Security Worker Licence
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

	memberList: Array<any> = [];

	dataSource!: MatTableDataSource<any>;
	columns: string[] = [
		'licenceHolderName',
		'licenceNumber',
		'licenceStatusCode',
		'expiryDate',
		'clearanceStatus',
		'action1',
		'action2',
	];

	constructor(private dialog: MatDialog, private utilService: UtilService, private hotToastService: HotToastService) {}

	ngOnInit(): void {
		this.memberList = this.membersArray.value;
		this.dataSource = new MatTableDataSource(this.memberList);
		this.updateAndSortData();
	}

	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		return true; // TODO return this.form.valid;
	}

	onRemoveMember(index: number) {
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
					this.memberList.splice(index, 1);
					this.dataSource = new MatTableDataSource(this.memberList);
				}
			});
	}

	onAddMemberWithSWL(): void {
		this.dialog
			.open(ModalMemberWithSwlAddComponent, {
				width: '800px',
				data: {}, //dialogOptions,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				if (resp) {
					this.memberList.push(resp.data);
					this.hotToastService.success('Controlling member was successfully added');
					this.updateAndSortData();
				}
			});
	}

	onEditMemberWithoutSWL(member: any): void {
		this.memberDialog(member, false);
	}

	onAddMemberWithoutSWL(): void {
		this.memberDialog({}, true);
	}

	private updateAndSortData() {
		this.memberList = [...this.memberList].sort((a, b) => {
			return this.utilService.sortByDirection(a.fullName, b.fullName, 'asc');
		});
		this.dataSource.data = this.memberList;
	}

	private memberDialog(dialogOptions: any, isCreate: boolean): void {
		this.dialog
			.open(ModalMemberWithoutSwlEditComponent, {
				width: '800px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				if (resp) {
					if (isCreate) {
						this.memberList.push(resp.data);
						this.hotToastService.success('Controlling member was successfully added');
						this.updateAndSortData();
					} else {
						const memberIndex = this.memberList.findIndex((item) => item.id == dialogOptions.id!);
						if (memberIndex >= 0) {
							this.memberList[memberIndex] = resp.data;
							this.updateAndSortData();
						}
						this.hotToastService.success('Controlling member was successfully updated');
					}
				}
			});
	}

	get membersArray(): FormArray {
		return <FormArray>this.form.get('members');
	}
}
