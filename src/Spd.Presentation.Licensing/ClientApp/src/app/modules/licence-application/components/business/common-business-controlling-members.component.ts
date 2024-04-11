import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { UtilService } from '@app/core/services/util.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { HotToastService } from '@ngneat/hot-toast';
import { MemberWithSwlAddModalComponent } from './member-with-swl-add-modal.component';
import { MemberWithoutSwlEditModalComponent } from './member-without-swl-edit-modal.component';

@Component({
	selector: 'app-common-business-controlling-members',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row mt-4" *ngIf="dataSource.data.length > 0">
				<div class="col-12">
					<mat-table [dataSource]="dataSource">
						<ng-container matColumnDef="fullName">
							<mat-header-cell *matHeaderCellDef>Full Name</mat-header-cell>
							<mat-cell *matCellDef="let member">
								<span class="mobile-label">Full Name:</span>
								{{ member.fullName | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="licenceNumber">
							<mat-header-cell *matHeaderCellDef>Security Worker Licence Number</mat-header-cell>
							<mat-cell *matCellDef="let member">
								<span class="mobile-label">Security Worker Licence Number:</span>
								{{ member.licenceNumber | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="status">
							<mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
							<mat-cell *matCellDef="let member">
								<span class="mobile-label">Status:</span>
								{{ member.status | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="expiryDate">
							<mat-header-cell *matHeaderCellDef>Expiry Date</mat-header-cell>
							<mat-cell *matCellDef="let member">
								<span class="mobile-label">Expiry Date:</span>
								{{ member.expiryDate | default }}
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
							<mat-cell *matCellDef="let member; let i = index">
								<button
									mat-flat-button
									class="table-button w-auto"
									style="color: var(--color-red);"
									aria-label="Remove controlling member"
									(click)="onRemoveRow(i)"
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

			<div class="text-minor-heading mt-4 mb-2">Add controlling members</div>
			<div class="row">
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
		`,
	],
})
export class CommonBusinessControllingMembersComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	@Input() form!: FormGroup;

	memberList: Array<any> = [];

	dataSource!: MatTableDataSource<any>;
	columns: string[] = ['fullName', 'licenceNumber', 'status', 'expiryDate', 'clearanceStatus', 'action1'];

	constructor(private dialog: MatDialog, private utilService: UtilService, private hotToastService: HotToastService) {}

	ngOnInit(): void {
		this.memberList = [
			{
				id: 1,
				fullName: 'Barbara Streisand',
				licenceNumber: '7465766',
				status: null,
				expiryDate: null,
				clearanceStatus: null,
			},
			{
				id: 2,
				fullName: 'Yank Alexander',
				licenceNumber: '2345433',
				status: null,
				expiryDate: null,
				clearanceStatus: null,
			},
			{
				id: 3,
				fullName: 'Anderson Cooper',
				licenceNumber: null,
				status: null,
				expiryDate: null,
				clearanceStatus: null,
			},
		];
		this.dataSource = new MatTableDataSource(this.memberList);
		this.onSortData();
	}

	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}

	onRemoveRow(index: number) {
		this.memberList.splice(index, 1);
		this.dataSource = new MatTableDataSource(this.memberList);
	}

	onAddMemberWithSWL(): void {
		this.dialog
			.open(MemberWithSwlAddModalComponent, {
				width: '800px',
				data: {}, //dialogOptions,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				if (resp) {
					this.memberList.push(resp.data);
					this.hotToastService.success('Controlling member was successfully added');
					// this.dataSource.sort = this.sort;
				}
			});
	}

	onRemoveMember(index: number): void {
		this.memberList.splice(index, 1);
		this.dataSource = new MatTableDataSource(this.memberList);
	}

	onEditMemberWithoutSWL(member: any): void {
		this.memberDialog(member, false);
	}

	onAddMemberWithoutSWL(): void {
		this.memberDialog({}, true);
	}

	private memberDialog(dialogOptions: any, isCreate: boolean): void {
		this.dialog
			.open(MemberWithoutSwlEditModalComponent, {
				width: '800px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				if (resp) {
					if (isCreate) {
						this.memberList.push(resp.data);
						this.hotToastService.success('Controlling member was successfully added');
					} else {
						const memberIndex = this.memberList.findIndex((item) => item.id == dialogOptions.id!);
						if (memberIndex >= 0) {
							this.memberList[memberIndex] = resp.data;
							this.dataSource.data = this.memberList;
						}
						this.hotToastService.success('Controlling member was successfully updated');
					}
					// this.dataSource.sort = this.sort;
				}
			});
	}

	onSearch(): void {
		const fullName = 'Timothy Test';
		this.memberList.push({
			id: 1,
			fullName,
			licenceNumber: '87657453',
			licenceStatus: 'Valid',
		});
		this.hotToastService.success('Controlling member was successfully added');
		this.onSortData();
	}

	onSortData() {
		this.memberList = [...this.memberList].sort((a, b) => {
			return this.utilService.sortByDirection(a.fullName, b.fullName, 'asc');
		});
		this.dataSource.data = this.memberList;
	}

	get hasMembersWithSwl(): FormControl {
		return this.form.get('hasMembersWithSwl') as FormControl;
	}
	get membersArray(): FormArray {
		return <FormArray>this.form.get('members');
	}
}
