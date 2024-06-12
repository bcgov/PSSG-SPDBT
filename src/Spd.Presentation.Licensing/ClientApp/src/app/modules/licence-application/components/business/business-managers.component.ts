import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { HotToastService } from '@ngneat/hot-toast';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { ModalBusinessManagerEditComponent } from './modal-business-manager-edit.component';

@Component({
	selector: 'app-business-managers',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Business Managers</h2>
						</div>

						<div class="col-xl-6 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								<button
									mat-stroked-button
									color="primary"
									class="large w-auto mb-3"
									aria-label="Back"
									(click)="onCancel()"
								>
									<mat-icon>arrow_back</mat-icon>Back
								</button>
							</div>
						</div>
						<div class="col-12">
							We require contact information for your company's business manager(s), who will be responsible for
							day-to-day supervision of licensed security employees in B.C. in accordance with section 14(2) of the
							<i>Security Services Act</i>.
						</div>
					</div>

					<mat-divider class="mat-divider-main my-3"></mat-divider>

					<div class="row mb-3">
						<div class="col-xl-8 col-lg-8 col-md-8 col-sm-6 my-auto">
							Your organization must have one primary business manager, and may have up to five other business managers.
						</div>
						<div class="col-xl-4 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								<button
									mat-flat-button
									type="button"
									color="primary"
									class="large w-auto mb-2"
									(click)="onAddManager()"
									*ngIf="showAdd"
								>
									Add Manager
								</button>
							</div>
						</div>
					</div>

					<div class="row mb-4">
						<div class="col-12">
							<mat-table [dataSource]="dataSource">
								<ng-container matColumnDef="status">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Status</mat-header-cell>
									<mat-cell *matCellDef="let manager">
										<span class="mobile-label">Status:</span>
										<mat-chip-row aria-label="Status" class="mat-chip-green" *ngIf="manager.isActive; else notactive">
											Active
										</mat-chip-row>
										<ng-template #notactive>
											<mat-chip-row aria-label="Status" class="mat-chip-yellow"> Pending </mat-chip-row>
										</ng-template>
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="managerRoleCode">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Authorization Type</mat-header-cell>
									<mat-cell *matCellDef="let manager">
										<span class="mobile-label">Authorization Type:</span>
										{{ manager.managerRoleCode }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="branchManager">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Applicant Name</mat-header-cell>
									<mat-cell *matCellDef="let manager">
										<span class="mobile-label">Applicant Name:</span>
										{{ manager | fullname | default }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="emailAddress">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Email</mat-header-cell>
									<mat-cell class="mat-cell-email" *matCellDef="let manager">
										<span class="mobile-label">Email:</span>
										{{ manager.emailAddress | default }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="phoneNumber">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Phone Number</mat-header-cell>
									<mat-cell *matCellDef="let manager">
										<span class="mobile-label">Phone Number:</span>
										{{ manager.phoneNumber | formatPhoneNumber | default }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="action1">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
									<mat-cell *matCellDef="let manager">
										<button
											mat-flat-button
											class="table-button"
											style="color: var(--color-green);"
											aria-label="Edit manager"
											(click)="onMaintainManager(manager)"
										>
											<mat-icon>edit</mat-icon>Edit
										</button>
									</mat-cell>
								</ng-container>

								<!--
									*ngIf="allowEditRow(manager)"
									*ngIf="allowDeleteRow(manager)"
								-->

								<ng-container matColumnDef="action2">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
									<mat-cell *matCellDef="let manager">
										<ng-container *ngIf="manager.isActive; else notactiveactions">
											<button
												mat-flat-button
												class="table-button"
												style="color: var(--color-red);"
												aria-label="Remove manager"
												(click)="onDeleteManager(manager)"
											>
												<mat-icon>delete_outline</mat-icon>Remove
											</button>
										</ng-container>
										<ng-template #notactiveactions>
											<button
												mat-flat-button
												class="table-button"
												style="color: var(--color-primary-light);"
												aria-label="Cancel manager invitation"
												(click)="OnCancelManager(manager)"
											>
												<mat-icon>cancel</mat-icon>Cancel
											</button>
										</ng-template>
									</mat-cell>
								</ng-container>

								<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
								<mat-row class="mat-data-row" *matRowDef="let row; columns: columns"></mat-row>
							</mat-table>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			@media (min-width: 1200px) {
				/* only force max width on large screens */
				.mat-column-status {
					max-width: 130px;
				}
				.mat-column-managerRoleCode {
					max-width: 130px;
				}
			}

			.mat-column-action1 {
				min-width: 170px;
				.table-button {
					min-width: 150px;
				}
			}

			.mat-column-action2 {
				min-width: 170px;
				.table-button {
					min-width: 150px;
				}
			}
		`,
	],
})
export class BusinessManagersComponent implements OnInit {
	dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
	columns: string[] = [
		'status',
		'managerRoleCode',
		'branchManager',
		'emailAddress',
		'phoneNumber',
		'action1',
		'action2',
	];

	maximumNumberOfManagers = 6;
	maximumNumberOfPrimaryManagers = 1;

	showAdd = false;
	isAllowedAddManager = false;
	isAllowedAddPrimary = false;

	managersList: any[] = [];

	constructor(private router: Router, private hotToastService: HotToastService, private dialog: MatDialog) {}

	ngOnInit(): void {
		this.managersList = [
			{
				id: '7ca9f3fa-92a1-4682-bf47-02a9f5d6a7d9',
				managerRoleCode: 'Contact',
				givenName: 'Bengal',
				surname: 'Benny',
				emailAddress: 'asdf23@asdf.com',
				jobTitle: 'Test',
				phoneNumber: '345-345-3453',
				isActive: true,
			},
			{
				id: 'd64ecf3b-e2f3-483e-b7f7-337dbec86da3',
				managerRoleCode: 'Primary',
				givenName: 'Victoria',
				surname: 'Charity',
				emailAddress: 'victoria.charity@quartech.com',
				jobTitle: 'test',
				phoneNumber: '444-444-4444',
				isActive: true,
			},
			{
				id: '985f7251-daa2-4f35-abef-882c70690acc',
				managerRoleCode: 'Contact',
				givenName: 'Nick',
				surname: 'Nanson',
				emailAddress: 'nick.nanson@test.com',
				jobTitle: 'Test',
				phoneNumber: '250-888-9999',
				isActive: false,
			},
			{
				id: '8343b143-c09f-427a-8673-9cfc62cd3ef3',
				managerRoleCode: 'Primary',
				givenName: 'Jim',
				surname: 'Brad',
				emailAddress: 'jim.brad@gov.bc.ca',
				jobTitle: null,
				phoneNumber: null,
				isActive: true,
			},
		];

		this.sortUsers();
		this.setFlags();
		this.dataSource = new MatTableDataSource(this.managersList);
	}

	onCancel(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessApplications());
	}

	onMaintainManager(manager: any): void {
		this.openManagerDialog(manager, false);
	}

	onAddManager(): void {
		this.openManagerDialog(null, true);
	}

	onDeleteManager(manager: any): void {
		this.deleteManager({
			manager,
			title: 'Confirmation',
			message: `Are you sure you want to permanently remove '${manager.givenName} ${manager.surname}'?`,
			actionText: 'Yes, remove',
			success: 'Manager was successfully removed',
		});
	}

	OnCancelManager(manager: any) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: `Are you sure you want to cancel the request for '${manager.givenName} ${manager.surname}'?`,
			actionText: 'Yes',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					// this.applicationService
					// 	.apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete({
					// 		applicationInviteId: application.id!,
					// 		orgId: application.orgId!,
					// 	})
					// 	.pipe()
					// 	.subscribe((_res) => {
					// 		this.hotToast.success('The request was successfully cancelled');
					// 		this.loadList();
					// 	});
				}
			});
	}

	private setFlags(): void {
		this.showAdd = this.isUserPrimaryManager();
		this.isAllowedAddManager = this.managersList.length < this.maximumNumberOfManagers;

		const numberOfPrimary = this.managersList.filter(
			(manager) => manager.managerRoleCode == 'Primary' // TODO update to use code
		)?.length;
		this.isAllowedAddPrimary = !(numberOfPrimary >= this.maximumNumberOfPrimaryManagers);
	}

	private sortUsers(): void {
		this.managersList.sort((a: any, b: any) => {
			const a1 = a.isActive ? 'a' : 'b';
			const b1 = b.isActive ? 'a' : 'b';
			const a2 = a.managerRoleCode?.toString() ?? '';
			const b2 = b.managerRoleCode?.toString() ?? '';
			const a3 = a.givenName?.toUpperCase() ?? '';
			const b3 = b.givenName?.toUpperCase() ?? '';
			const a4 = a.surname?.toUpperCase() ?? '';
			const b4 = b.surname?.toUpperCase() ?? '';
			return a1.localeCompare(b1) || a2.localeCompare(b2) * -1 || a3.localeCompare(b3) || a4.localeCompare(b4);
		});
	}

	private openManagerDialog(manager: any | null, isCreate: boolean): void {
		const data: DialogOptions = { data: manager ? { ...manager } : null };
		this.dialog
			.open(ModalBusinessManagerEditComponent, {
				width: '800px',
				data,
				autoFocus: true,
			})
			.afterClosed()
			.subscribe((resp) => {
				if (resp) {
					if (isCreate) {
						this.managersList.push(resp.data);
						this.hotToastService.success('Business Manager was successfully added');
					} else {
						const branchIndex = this.managersList.findIndex((item) => item.id == manager.id!);
						if (branchIndex >= 0) {
							this.managersList[branchIndex] = resp.data;
							this.dataSource.data = this.managersList;
						}
						this.hotToastService.success('Business Manager was successfully updated');
					}
					this.sortUsers();
					this.setFlags();
					this.dataSource = new MatTableDataSource(this.managersList);
				}
			});
	}

	private deleteManager(params: { manager: any; title: string; message: string; actionText: string; success: string }) {
		const data: DialogOptions = {
			icon: 'warning',
			title: params.title,
			message: params.message,
			actionText: params.actionText,
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					// this.orgUserService
					// 	.apiOrgsOrgIdUsersUserIdDelete({ userId: params.user.id!, orgId: params.user.organizationId! })
					// 	.pipe()
					// 	.subscribe((_res) => {
					this.managersList.splice(
						this.managersList.findIndex((item) => item.id == params.manager.id!),
						1
					);
					this.setFlags();
					this.hotToastService.success(params.success);
					this.dataSource = new MatTableDataSource(this.managersList);
					// 	});
				}
			});
	}

	private isUserPrimaryManager(): boolean {
		if (!this.managersList) {
			return false;
		}

		// const currUser = this.managersList.find((item) => item.id == this.authUserService.bceidUserInfoProfile?.userId);
		// return currUser ? currUser.contactAuthorizationTypeCode == 'Primary' : false;
		return true; // TODO remove harcode.
	}
}
