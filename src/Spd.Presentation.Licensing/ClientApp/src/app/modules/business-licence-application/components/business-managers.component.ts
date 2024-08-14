import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BizPortalUserListResponse, BizPortalUserResponse, ContactAuthorizationTypeCode } from '@app/api/models';
import { AuthUserBceidService } from '@app/core/services/auth-user-bceid.service';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { HotToastService } from '@ngneat/hot-toast';
import { BusinessLicenceApplicationRoutes } from '../business-licence-application-routing.module';
import { BizPortalUserDialogData, ModalBusinessManagerEditComponent } from './modal-business-manager-edit.component';

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
							<div class="mt-2">
								<ul>
									<li class="mb-1">
										Your organization may have up to {{ maximumNumberOfPrimaryContacts }} primary business managers and
										up to {{ maximumNumberOfContacts }} business managers.
									</li>
									<li class="mb-1">Invitations will expire 7 days after being sent.</li>
								</ul>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-12" *ngIf="showAdd">
							<div class="d-flex justify-content-end" *ngIf="isAllowedAddManager === true; else addNotAllowed">
								<button
									mat-flat-button
									type="button"
									color="primary"
									class="large w-auto mb-2"
									aria-label="Add user"
									(click)="onAddUser()"
									*ngIf="showAdd"
								>
									Add Manager
								</button>
							</div>
							<ng-template #addNotAllowed>
								<div class="alert alert-warning d-flex" role="alert">
									<div>The maximum number of business managers has been reached</div>
								</div>
							</ng-template>
						</div>
					</div>

					<div class="row mb-4">
						<div class="col-12">
							<mat-table [dataSource]="dataSource">
								<ng-container matColumnDef="status">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Status</mat-header-cell>
									<mat-cell *matCellDef="let user">
										<span class="mobile-label">Status:</span>
										<mat-chip-row aria-label="Status" class="mat-chip-green" *ngIf="user.isActive; else notactive">
											Active
										</mat-chip-row>
										<ng-template #notactive>
											<mat-chip-row aria-label="Status" class="mat-chip-yellow"> Pending </mat-chip-row>
										</ng-template>
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="contactAuthorizationTypeCode">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Authorization Type</mat-header-cell>
									<mat-cell *matCellDef="let user">
										<span class="mobile-label">Authorization Type:</span>
										{{ user.contactAuthorizationTypeCode | options : 'ContactAuthorizationTypes' }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="branchManager">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Manager Name</mat-header-cell>
									<mat-cell *matCellDef="let user">
										<span class="mobile-label">Manager Name:</span>
										{{ user | fullname | default }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="email">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Email</mat-header-cell>
									<mat-cell class="mat-cell-email" *matCellDef="let user">
										<span class="mobile-label">Email:</span>
										{{ user.email | default }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="phoneNumber">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Phone Number</mat-header-cell>
									<mat-cell *matCellDef="let user">
										<span class="mobile-label">Phone Number:</span>
										{{ user.phoneNumber | formatPhoneNumber | default }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="action1">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
									<mat-cell *matCellDef="let user">
										<button
											mat-flat-button
											class="table-button"
											style="color: var(--color-green);"
											aria-label="Edit user"
											*ngIf="allowEditRow(user)"
											(click)="onMaintainUser(user)"
										>
											<mat-icon>edit</mat-icon>Edit
										</button>
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="action2">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
									<mat-cell *matCellDef="let user">
										<ng-container *ngIf="isCurrentPrimaryManager">
											<ng-container *ngIf="user.isActive; else notactiveactions">
												<button
													mat-flat-button
													class="table-button"
													style="color: var(--color-red);"
													aria-label="Remove user"
													(click)="onDeleteUser(user)"
													*ngIf="allowDeleteRow(user)"
												>
													<mat-icon>delete_outline</mat-icon>Remove
												</button>
											</ng-container>
											<ng-template #notactiveactions>
												<button
													mat-flat-button
													class="table-button"
													style="color: var(--color-primary-light);"
													aria-label="Cancel invitation"
													(click)="onCancelInvitation(user)"
												>
													<mat-icon>cancel</mat-icon>Cancel
												</button>
											</ng-template>
										</ng-container>
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
				.mat-column-contactAuthorizationTypeCode {
					min-width: 180px;
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
	readonly DEFAULT_MAX_NUMBER_OF_CONTACTS = 6;
	readonly DEFAULT_MAX_NUMBER_OF_PRIMARY_CONTACTS = 2;

	dataSource: MatTableDataSource<BizPortalUserResponse> = new MatTableDataSource<BizPortalUserResponse>([]);
	columns: string[] = [
		'status',
		'contactAuthorizationTypeCode',
		'branchManager',
		'email',
		'phoneNumber',
		'action1',
		'action2',
	];

	maximumNumberOfContacts = this.DEFAULT_MAX_NUMBER_OF_CONTACTS;
	maximumNumberOfPrimaryContacts = this.DEFAULT_MAX_NUMBER_OF_PRIMARY_CONTACTS;

	showAdd = false;
	isAllowedAddManager = false;
	isAllowedAddPrimaryManager = false;
	isCurrentPrimaryManager = false;

	usersList: any[] = [];

	constructor(
		private router: Router,
		private dialog: MatDialog,
		private hotToastService: HotToastService,
		private authUserBceidService: AuthUserBceidService,
		private businessApplicationService: BusinessApplicationService
	) {}

	ngOnInit(): void {
		this.loadList();
	}

	onCancel(): void {
		this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
	}

	onMaintainUser(user: BizPortalUserResponse): void {
		let isAllowedPrimary = this.isAllowedAddPrimaryManager;
		if (user.contactAuthorizationTypeCode == ContactAuthorizationTypeCode.PrimaryBusinessManager) {
			isAllowedPrimary = true;
		}

		const isAllowedNonPrimary = this.getNumberOfPrimaryBusinessManagers() > 1;

		const dialogOptions: BizPortalUserDialogData = {
			user,
			isAllowedNonPrimaryManager: isAllowedNonPrimary,
			isAllowedPrimaryManager: isAllowedPrimary,
			emails: this.dataSource.data
				.filter((item: BizPortalUserResponse) => item.id != user.id)
				.map((item: BizPortalUserResponse) => item.email!),
		};
		this.openManagerDialog(dialogOptions, false);
	}

	onAddUser(): void {
		const newUser: BizPortalUserResponse = {};
		const dialogOptions: BizPortalUserDialogData = {
			user: newUser,
			isAllowedNonPrimaryManager: true,
			isAllowedPrimaryManager: this.isAllowedAddPrimaryManager,
			emails: this.dataSource.data.map((item: BizPortalUserResponse) => item.email!),
		};
		this.openManagerDialog(dialogOptions, true);
	}

	onDeleteUser(user: BizPortalUserResponse): void {
		this.deleteUser({
			user,
			title: 'Confirmation',
			message: `Are you sure you want to permanently remove '${user.firstName} ${user.lastName}'?`,
			actionText: 'Yes, remove',
			success: 'Business Manager was successfully removed',
		});
	}

	onCancelInvitation(user: BizPortalUserResponse) {
		this.deleteUser({
			user,
			title: 'Confirmation',
			message: 'Are you sure you want to cancel this invitation?',
			actionText: 'Yes, cancel',
			success: 'Invitation was successfully cancelled',
		});
	}

	allowEditRow(user: BizPortalUserResponse): boolean {
		// if row is current user, allow edit
		if (this.isCurrentUser(user)) {
			return true;
		}

		// // if row is not active user, prevent edit
		if (!user.isActive) {
			return false;
		}

		// if current user is a Primary Authorized User, allow edit
		return this.isCurrentUserPrimaryAuthorizedUser();
	}

	allowDeleteRow(user: BizPortalUserResponse): boolean {
		// if row is current user, prevent delete
		if (this.isCurrentUser(user)) {
			return false;
		}

		// if current user is a Primary Authorized User, allow delete
		return this.isCurrentUserPrimaryAuthorizedUser();
	}

	private loadList(): void {
		this.businessApplicationService.getBizPortalUsers().subscribe((resp: BizPortalUserListResponse) => {
			this.maximumNumberOfContacts = resp.maximumNumberOfAuthorizedContacts ?? this.DEFAULT_MAX_NUMBER_OF_CONTACTS;
			this.maximumNumberOfPrimaryContacts =
				resp.maximumNumberOfPrimaryAuthorizedContacts ?? this.DEFAULT_MAX_NUMBER_OF_PRIMARY_CONTACTS;

			this.usersList = resp.users ?? [];

			this.sortUsers();
			this.setFlags();
			this.dataSource = new MatTableDataSource(this.usersList);
		});
	}

	private setFlags(): void {
		this.showAdd = this.isCurrentUserPrimaryAuthorizedUser();
		this.isAllowedAddManager = this.usersList.length < this.maximumNumberOfContacts;

		const numberOfPrimary = this.getNumberOfPrimaryBusinessManagers();
		this.isAllowedAddPrimaryManager = numberOfPrimary < this.maximumNumberOfPrimaryContacts;

		this.isCurrentPrimaryManager = this.isCurrentUserPrimaryAuthorizedUser();
	}

	private getNumberOfPrimaryBusinessManagers(): number {
		return this.usersList.filter(
			(user) => user.contactAuthorizationTypeCode == ContactAuthorizationTypeCode.PrimaryBusinessManager
		)?.length;
	}

	private sortUsers(): void {
		this.usersList.sort((a: BizPortalUserResponse, b: BizPortalUserResponse) => {
			const a1 = a.isActive ? 'a' : 'b';
			const b1 = b.isActive ? 'a' : 'b';
			const a2 = a.contactAuthorizationTypeCode?.toString() ?? '';
			const b2 = b.contactAuthorizationTypeCode?.toString() ?? '';
			const a3 = a.firstName?.toUpperCase() ?? '';
			const b3 = b.firstName?.toUpperCase() ?? '';
			const a4 = a.lastName?.toUpperCase() ?? '';
			const b4 = b.lastName?.toUpperCase() ?? '';
			return a1.localeCompare(b1) || a2.localeCompare(b2) * -1 || a3.localeCompare(b3) || a4.localeCompare(b4);
		});
	}

	private openManagerDialog(dialogOptions: BizPortalUserDialogData, isCreate: boolean): void {
		this.dialog
			.open(ModalBusinessManagerEditComponent, {
				width: '800px',
				data: dialogOptions,
				autoFocus: true,
			})
			.afterClosed()
			.subscribe((resp) => {
				if (resp) {
					if (isCreate) {
						this.hotToastService.success('Business Manager was successfully added');
					} else {
						this.hotToastService.success('Business Manager was successfully updated');
					}
					this.loadList();
				}
			});
	}

	private deleteUser(params: {
		user: BizPortalUserResponse;
		title: string;
		message: string;
		actionText: string;
		success: string;
	}) {
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
					this.businessApplicationService
						.deleteBizPortalUser(params.user.id!)
						.pipe()
						.subscribe((_res) => {
							this.hotToastService.success(params.success);

							this.loadList();
						});
				}
			});
	}

	private isCurrentUserPrimaryAuthorizedUser(): boolean {
		if (!this.usersList) {
			return false;
		}

		return this.isUserPrimaryAuthorizedUser(this.authUserBceidService.bceidUserProfile?.bizUserId!);
	}

	private isUserPrimaryAuthorizedUser(userId: string): boolean {
		if (!this.usersList) {
			return false;
		}

		const currUser = this.usersList.find((item: BizPortalUserResponse) => item.id == userId);
		return currUser
			? currUser.contactAuthorizationTypeCode == ContactAuthorizationTypeCode.PrimaryBusinessManager
			: false;
	}

	private isCurrentUser(user: BizPortalUserResponse): boolean {
		return this.authUserBceidService.bceidUserProfile?.bizUserId === user.id;
	}
}
