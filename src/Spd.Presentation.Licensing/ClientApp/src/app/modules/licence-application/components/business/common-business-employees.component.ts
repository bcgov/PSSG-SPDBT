import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { UtilService } from '@app/core/services/util.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { HotToastService } from '@ngneat/hot-toast';
import { ModalMemberWithSwlAddComponent } from './modal-member-with-swl-add.component';

@Component({
	selector: 'app-common-business-employees',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row mt-4" *ngIf="dataSource.data.length > 0">
				<div class="col-12">
					<mat-table [dataSource]="dataSource">
						<ng-container matColumnDef="fullName">
							<mat-header-cell *matHeaderCellDef>Full Name</mat-header-cell>
							<mat-cell *matCellDef="let member">
								<span class="mobile-label">Full Name:</span>
								{{ member | fullname | default }}
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

			<div class="row">
				<div class="col-xl-4 col-lg-6 col-md-12">
					<button mat-flat-button color="primary" class="large mt-4 mb-2" (click)="onAddLicenceHolder()">
						Add Licence Holder
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

	licenceHolderList: Array<any> = [];

	dataSource!: MatTableDataSource<any>;
	columns: string[] = ['fullName', 'licenceNumber', 'status', 'expiryDate', 'action1'];

	constructor(private dialog: MatDialog, private utilService: UtilService, private hotToastService: HotToastService) {}

	ngOnInit(): void {
		this.licenceHolderList = [
			{
				id: 1,
				givenName: 'Barbara',
				surname: 'Streisand',
				licenceNumber: '7465766',
				status: 'Valid',
				expiryDate: '2024-05-15',
			},
			{
				id: 2,
				givenName: 'Yank',
				surname: 'Alexander',
				licenceNumber: '2345433',
				status: 'Expired',
				expiryDate: '2023-02-25',
			},
		];
		this.dataSource = new MatTableDataSource(this.licenceHolderList);
		this.updateAndSortData();
	}

	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}

	onRemoveMember(index: number) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this licence holder?',
			actionText: 'Yes, remove',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.licenceHolderList.splice(index, 1);
					this.dataSource = new MatTableDataSource(this.licenceHolderList);
				}
			});
	}

	onAddLicenceHolder(): void {
		this.dialog
			.open(ModalMemberWithSwlAddComponent, {
				width: '800px',
				data: {}, //dialogOptions,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				if (resp) {
					this.licenceHolderList.push(resp.data);
					this.hotToastService.success('Licence Holder was successfully added');
					this.updateAndSortData();
				}
			});
	}

	private updateAndSortData() {
		this.licenceHolderList = [...this.licenceHolderList].sort((a, b) => {
			return this.utilService.sortByDirection(a.fullName, b.fullName, 'asc');
		});
		this.dataSource.data = this.licenceHolderList;
	}

	get hasMembersWithSwl(): FormControl {
		return this.form.get('hasMembersWithSwl') as FormControl;
	}
	get membersArray(): FormArray {
		return <FormArray>this.form.get('members');
	}
}