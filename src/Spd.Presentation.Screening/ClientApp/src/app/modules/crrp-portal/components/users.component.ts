import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ContactAuthorizationTypeCode, OrgUserListResponse, OrgUserResponse } from 'src/app/api/models';
import { OrgUserService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { ContactAuthorizationTypes, SelectOptions } from 'src/app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { UserDialogData, UserEditModalComponent } from './user-edit-modal.component';

@Component({
	selector: 'app-users',
	template: `
		<app-crrp-header></app-crrp-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row mb-2">
				<div class="col-xxl-10 col-xl-9 col-lg-9 col-md-8 col-sm-12">
					<h2 class="mb-2">
						User Management <mat-icon class="info-icon" (click)="onManageUsersInfo()">info</mat-icon>
						<div class="mt-2 fs-5 fw-light">
							<ul>
								<li class="mb-1">
									Your organization may have up to {{ maximumNumberOfPrimaryContacts }} primary authorized contacts and
									up to {{ maximumNumberOfContacts }} authorized contacts
								</li>
								<li class="mb-1">Invitations will expire 7 days after being sent</li>
							</ul>
						</div>
					</h2>
				</div>
				<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-12 my-auto" *ngIf="showAddArea">
					<div class="text-end" *ngIf="isAllowedAddContact === true; else addNotAllowed">
						<button mat-flat-button class="large w-auto mat-green-button mb-2" (click)="onAddUser()">Add User</button>
					</div>
					<ng-template #addNotAllowed>
						<div class="alert alert-warning d-flex" role="alert">
							<div>The maximum number of authorized users has been reached</div>
						</div>
					</ng-template>
				</div>
			</div>

			<div class="row mb-2">
				<div class="col-12">
					<mat-divider class="mat-divider-main mb-3"></mat-divider>
					<mat-table [dataSource]="dataSource">
						<ng-container matColumnDef="status">
							<mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
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
							<mat-header-cell *matHeaderCellDef>Authorization Type</mat-header-cell>
							<mat-cell *matCellDef="let user">
								<span class="mobile-label">Authorization Type:</span>
								{{ user.contactAuthorizationTypeCode }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="applicantName">
							<mat-header-cell *matHeaderCellDef>Applicant Name</mat-header-cell>
							<mat-cell *matCellDef="let user">
								<span class="mobile-label">Applicant Name:</span>
								{{ user | fullname | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="email">
							<mat-header-cell *matHeaderCellDef>Email</mat-header-cell>
							<mat-cell class="mat-cell-email" *matCellDef="let user">
								<span class="mobile-label">Email:</span>
								{{ user.email | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="phoneNumber">
							<mat-header-cell *matHeaderCellDef>Phone Number</mat-header-cell>
							<mat-cell *matCellDef="let user">
								<span class="mobile-label">Phone Number:</span>
								{{ user.phoneNumber || '' | mask : appConstants.phone.displayMask | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="jobTitle">
							<mat-header-cell *matHeaderCellDef>Job Title</mat-header-cell>
							<mat-cell *matCellDef="let user">
								<span class="mobile-label">Job Title:</span>
								{{ user.jobTitle | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action1">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let user">
								<button
									mat-flat-button
									class="table-button"
									style="color: var(--color-green);"
									(click)="onMaintainUser(user)"
									*ngIf="allowEditRow(user)"
									aria-label="Edit user"
								>
									<mat-icon>edit</mat-icon>Edit
								</button>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action2">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let user">
								<ng-container *ngIf="user.isActive; else notactiveactions">
									<button
										mat-flat-button
										class="table-button"
										style="color: var(--color-red);"
										(click)="onDeleteUser(user)"
										*ngIf="allowDeleteRow(user)"
										aria-label="Remove user"
									>
										<mat-icon>delete_outline</mat-icon>Remove
									</button>
								</ng-container>
								<ng-template #notactiveactions>
									<button
										mat-flat-button
										class="table-button"
										style="color: var(--color-primary-light);"
										(click)="onCancelInvitation(user)"
										aria-label="Cancel invitation"
									>
										<mat-icon>cancel</mat-icon>Cancel
									</button>
								</ng-template>
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
						<mat-row *matRowDef="let row; columns: columns"></mat-row>
					</mat-table>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.info-icon {
				color: var(--color-primary-light);
				cursor: pointer;
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
export class UsersComponent implements OnInit {
	readonly DEFAULT_MAX_NUMBER_OF_CONTACTS = 6;
	readonly DEFAULT_MAX_NUMBER_OF_PRIMARY_CONTACTS = 2;

	dataSource: MatTableDataSource<OrgUserResponse> = new MatTableDataSource<OrgUserResponse>([]);
	columns: string[] = [
		'status',
		'contactAuthorizationTypeCode',
		'applicantName',
		'email',
		'phoneNumber',
		'jobTitle',
		'action1',
		'action2',
	];

	maximumNumberOfContacts = this.DEFAULT_MAX_NUMBER_OF_CONTACTS;
	maximumNumberOfPrimaryContacts = this.DEFAULT_MAX_NUMBER_OF_PRIMARY_CONTACTS;

	appConstants = SPD_CONSTANTS;
	authorizationTypes = ContactAuthorizationTypes;

	showAddArea = false;
	isAllowedAddContact = false;
	isAllowedAddPrimary = false;

	usersList: OrgUserResponse[] = [];

	constructor(
		private router: Router,
		private dialog: MatDialog,
		private orgUserService: OrgUserService,
		private authUserService: AuthUserBceidService,
		private hotToast: HotToastService
	) {}

	ngOnInit(): void {
		const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		if (!orgId) {
			console.debug('UsersComponent - missing orgId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.loadList();
	}

	onAddUser(): void {
		const newUser: OrgUserResponse = {};
		const dialogOptions: UserDialogData = {
			user: newUser,
			isAllowedPrimary: this.isAllowedAddPrimary,
			emails: this.dataSource.data.map((item: OrgUserResponse) => item.email!),
		};
		this.userDialog(dialogOptions, true);
	}

	onMaintainUser(user: OrgUserResponse): void {
		let isAllowedPrimary = this.isAllowedAddPrimary;
		if (user.contactAuthorizationTypeCode == ContactAuthorizationTypeCode.Primary) {
			isAllowedPrimary = true;
		}
		const dialogOptions: UserDialogData = {
			user,
			isAllowedPrimary,
			emails: this.dataSource.data
				.filter((item: OrgUserResponse) => item.id != user.id)
				.map((item: OrgUserResponse) => item.email!),
		};
		this.userDialog(dialogOptions, false);
	}

	onDeleteUser(user: OrgUserResponse) {
		this.deleteUser({
			user,
			title: 'Confirmation',
			message: `Are you sure you want to permanently remove '${user.firstName} ${user.lastName}'?`,
			actionText: 'Yes, remove',
			success: 'User was successfully removed',
		});
	}

	onCancelInvitation(user: OrgUserResponse) {
		this.deleteUser({
			user,
			title: 'Confirmation',
			message: 'Are you sure you want to cancel this invitation?',
			actionText: 'Yes, cancel',
			success: 'Invitation was successfully cancelled',
		});
	}

	allowEditRow(user: OrgUserResponse): boolean {
		// if row is current user, allow edit
		if (this.authUserService.bceidUserInfoProfile?.userId == user.id) {
			return true;
		}

		// if row is not active user, prevent edit
		if (!user.isActive) {
			return false;
		}

		// if current user is a Primary Authorized User, allow edit
		return this.isUserPrimaryAuthorizedUser();
	}

	allowDeleteRow(user: OrgUserResponse): boolean {
		if (this.usersList.length <= 1) {
			return false;
		}

		// if row is current user, prevent delete
		if (this.authUserService.bceidUserInfoProfile?.userId == user.id) {
			return false;
		}

		// if current user is a Primary Authorized User, allow delete
		return this.isUserPrimaryAuthorizedUser();
	}

	onManageUsersInfo(): void {
		const title = 'What can authorized users do?';
		const message = `
		<strong>Primary Authorized Users</strong>
		<ul>
		<li>Add or remove others in their organization from the authorized contact roles</li>		
		<li>Transfer their primary authority to another additional authorized contact</li>		
		<li>Edit and update organization information</li>		
		<li>Initiate new criminal record checks</li>		
		<li>View application statuses</li>		
		<li>View expiring criminal record checks</li>		
		<li>View financial information and pay for criminal record checks</li>		
		</ul>
		<strong>Authorized Users</strong>
		<ul>
		<li>Initiate new criminal record checks</li>
		<li>View application statuses</li>
		<li>View expiring criminal record checks</li>
		<li>View financial information and pay for criminal record checks</li>
		</ul>
		`;

		const dialogOptions: DialogOptions = {
			icon: 'info_outline',
			type: 'info',
			title,
			message,
			cancelText: 'Close',
		};

		this.dialog.open(DialogComponent, { data: dialogOptions });
	}

	getDesc(val: string | undefined): string | null {
		if (!val) return null;

		const find = this.authorizationTypes.find((element: SelectOptions) => element.code == val);
		if (find) return find.desc as string;
		return null;
	}

	private sortUsers(): void {
		this.usersList.sort((a: OrgUserResponse, b: OrgUserResponse) => {
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

	private deleteUser(params: {
		user: OrgUserResponse;
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
					this.orgUserService
						.apiOrgsOrgIdUsersUserIdDelete({ userId: params.user.id!, orgId: params.user.organizationId! })
						.pipe()
						.subscribe((_res) => {
							this.usersList.splice(
								this.usersList.findIndex((item) => item.id == params.user.id!),
								1
							);
							this.setFlags();
							this.hotToast.success(params.success);
							this.dataSource = new MatTableDataSource(this.usersList);
						});
				}
			});
	}

	private loadList(): void {
		this.orgUserService
			.apiOrgsOrgIdUsersGet({ orgId: this.authUserService.bceidUserInfoProfile?.orgId! })
			.pipe()
			.subscribe((res: OrgUserListResponse) => {
				this.maximumNumberOfContacts = res.maximumNumberOfAuthorizedContacts ?? this.DEFAULT_MAX_NUMBER_OF_CONTACTS;
				this.maximumNumberOfPrimaryContacts =
					res.maximumNumberOfPrimaryAuthorizedContacts ?? this.DEFAULT_MAX_NUMBER_OF_PRIMARY_CONTACTS;

				this.usersList = res.users ?? [];
				this.sortUsers();
				this.setFlags();
				this.dataSource = new MatTableDataSource(this.usersList);
			});
	}

	private setFlags(): void {
		this.showAddArea = this.isUserPrimaryAuthorizedUser();
		this.isAllowedAddContact = this.usersList.length < this.maximumNumberOfContacts;

		const numberOfPrimary = this.usersList.filter(
			(user) => user.contactAuthorizationTypeCode == ContactAuthorizationTypeCode.Primary
		)?.length;
		this.isAllowedAddPrimary = !(numberOfPrimary >= this.maximumNumberOfPrimaryContacts);
	}

	private userDialog(dialogOptions: UserDialogData, isCreate: boolean): void {
		this.dialog
			.open(UserEditModalComponent, {
				width: '800px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp) => {
				if (resp) {
					if (isCreate) {
						// Add new user
						this.usersList.push(resp.data);
						this.hotToast.success('User was successfully added');
					} else {
						// Update user info
						const userIndex = this.usersList.findIndex((item) => item.id == dialogOptions.user.id!);
						if (userIndex >= 0) {
							this.usersList[userIndex] = resp.data;
						}
						this.hotToast.success('User was successfully updated');
					}
					this.sortUsers();
					this.setFlags();
					this.dataSource = new MatTableDataSource(this.usersList);
				}
			});
	}

	private isUserPrimaryAuthorizedUser(): boolean {
		if (!this.usersList) {
			return false;
		}

		const currUser = this.usersList.find((item) => item.id == this.authUserService.bceidUserInfoProfile?.userId);
		return currUser ? currUser.contactAuthorizationTypeCode == ContactAuthorizationTypeCode.Primary : false;
	}
}
