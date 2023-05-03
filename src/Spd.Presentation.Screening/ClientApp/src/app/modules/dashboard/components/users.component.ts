import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { ContactAuthorizationTypeCode, OrgUserListResponse, OrgUserResponse } from 'src/app/api/models';
import { OrgUserService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { ContactAuthorizationTypes, SelectOptions } from 'src/app/core/constants/model-desc';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { UserDialogData, UserEditModalComponent } from './user-edit-modal.component';

@Component({
	selector: 'app-users',
	template: `
		<app-dashboard-header subtitle="Criminal Record Check Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xxl-6 col-xl-7 col-lg-9 col-md-8 col-sm-12">
					<h2 class="mb-2 fw-normal">
						User Management <mat-icon class="info-icon" (click)="onManageUsersInfo()">info</mat-icon>
						<div class="mt-2 fs-5 fw-light">
							<ul>
								<li>
									Your organization may have up to {{ maximumNumberOfPrimaryContacts }} primary authorized contacts and
									up to {{ maximumNumberOfContacts }} authorized contacts
								</li>
								<li>Portal invitations will expire 7 days after being sent</li>
							</ul>
						</div>
					</h2>
				</div>
				<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-12 my-auto" *ngIf="showAddArea">
					<ng-container *ngIf="isAllowedAddContact == true; else addNotAllowed">
						<button mat-flat-button class="large w-100 mat-green-button mb-2" (click)="onAddUser()">Add User</button>
					</ng-container>
					<ng-template #addNotAllowed>
						<div class="alert alert-warning d-flex align-items-center" role="alert">
							<div>The maximum number of authorized users has been reached</div>
						</div>
					</ng-template>
				</div>
			</div>
			<ng-container *ngFor="let user of usersList; let i = index">
				<div class="row mt-2 mb-2">
					<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12">
						<section class="px-4 py-2 mb-3 card-section">
							<div class="row my-2">
								<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
									<ng-container *ngIf="user.isActive; else notactive">
										<div class="badge rounded-pill bg-success mb-2">Active</div>
									</ng-container>
									<ng-template #notactive>
										<div class="badge rounded-pill text-bg-secondary mb-2">Pending</div>
									</ng-template>

									<div class="row">
										<div class="col-xxl-4 col-xl-4 col-lg-6 col-md-12 mt-2 mt-lg-0">
											<small class="d-block text-muted">Authorization Type</small>
											<strong> {{ getDesc(user.contactAuthorizationTypeCode) | default }} </strong>
										</div>
										<div class="col-xxl-4 col-xl-4 col-lg-6 col-md-12">
											<small class="d-block text-muted">Name</small>
											<strong> {{ user | fullname | default }} </strong>
										</div>
										<div
											class="col-xxl-4 col-xl-4 col-lg-6 col-md-12 d-none d-xl-inline-flex"
											style="text-align: end; "
										>
											<ng-container *ngTemplateOutlet="actions"></ng-container>
										</div>
									</div>

									<div class="row">
										<div class="col-xxl-4 col-xl-4 col-lg-6 col-md-12 mt-0 mt-lg-2">
											<small class="d-block text-muted">Email</small>
											<strong> {{ user.email | default }} </strong>
										</div>
										<div class="col-xxl-4 col-xl-4 col-lg-6 col-md-12 mt-0 mt-lg-2">
											<small class="d-block text-muted">Phone Number</small>
											<strong>{{ user.phoneNumber || '' | mask : appConstants.phone.displayMask | default }}</strong>
										</div>
										<div class="col-xxl-4 col-xl-4 col-lg-6 col-md-12 mt-0 mt-lg-2">
											<small class="d-block text-muted">Job Title</small>
											<strong>{{ user.jobTitle | default }}</strong>
										</div>
									</div>
								</div>
								<div
									class="col-lg-6 col-md-12 col-sm-12 mx-auto d-flex flex-row d-xl-none"
									style="justify-content: end;"
								>
									<ng-container *ngTemplateOutlet="actions"></ng-container>
								</div>
							</div>
						</section>
					</div>
				</div>

				<ng-template #actions>
					<ng-container *ngIf="user.isActive; else notactiveactions">
						<button
							mat-stroked-button
							class="table-button my-2 me-4"
							(click)="onMaintainUser(user)"
							aria-label="Edit user"
						>
							<mat-icon>edit</mat-icon>Edit
						</button>
						<button
							mat-icon-button
							matTooltip="Remove user"
							class="table-button table-button__remove my-2"
							*ngIf="allowDeleteRow(user)"
							(click)="onDeleteUser(user)"
							aria-label="Remove user"
						>
							<mat-icon>delete_outline</mat-icon>
						</button>
					</ng-container>
					<ng-template #notactiveactions>
						<button
							mat-stroked-button
							class="table-button my-2 me-4"
							(click)="onCancelInvitation(user)"
							aria-label="Cancel invitation"
						>
							<mat-icon>clear</mat-icon>Cancel
						</button>
					</ng-template>
				</ng-template>
			</ng-container>
		</section>
	`,
	styles: [
		`
			.info-icon {
				color: var(--color-primary-light);
				cursor: pointer;
			}

			.table-button {
				vertical-align: text-top;

				&__remove {
					top: -8px;
					min-width: 50px;

					.mat-icon {
						top: -4px;
						position: relative;
					}
				}
			}

			.card-section {
				background-color: var(--color-card) !important;
				border-left: 4px solid var(--color-primary);
				border-bottom-width: 1px;
				border-bottom-style: solid;
				border-bottom-color: rgba(0, 0, 0, 0.12);
			}
		`,
	],
})
export class UsersComponent implements OnInit {
	readonly DEFAULT_MAX_NUMBER_OF_CONTACTS = 6;
	readonly DEFAULT_MAX_NUMBER_OF_PRIMARY_CONTACTS = 2;

	maximumNumberOfContacts = this.DEFAULT_MAX_NUMBER_OF_CONTACTS;
	maximumNumberOfPrimaryContacts = this.DEFAULT_MAX_NUMBER_OF_PRIMARY_CONTACTS;

	appConstants = SPD_CONSTANTS;
	authorizationTypes = ContactAuthorizationTypes;

	showAddArea: boolean = false;
	isAllowedAddContact: boolean = false;
	isAllowedAddPrimary: boolean = false;

	usersList: OrgUserResponse[] = [];

	constructor(
		private dialog: MatDialog,
		private orgUserService: OrgUserService,
		private authenticationService: AuthenticationService,
		private hotToast: HotToastService
	) {}

	ngOnInit(): void {
		this.loadListOfUsers();
	}

	onAddUser(): void {
		const newUser: OrgUserResponse = {};
		const dialogOptions: UserDialogData = {
			user: newUser,
			isAllowedPrimary: this.isAllowedAddPrimary,
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
		};
		this.userDialog(dialogOptions, false);
	}

	onDeleteUser(user: OrgUserResponse) {
		this.deleteUser({
			user,
			title: 'Delete user',
			message: 'Are you sure you want to permanently remove this user?',
			actionText: 'Yes, remove',
			success: 'User was successfully removed',
		});
	}

	onCancelInvitation(user: OrgUserResponse) {
		this.deleteUser({
			user,
			title: 'Cancel invitation',
			message: 'Are you sure you want to cancel this invitation?',
			actionText: 'Yes, cancel',
			success: 'Invitation was successfully cancelled',
		});
	}

	allowDeleteRow(user: OrgUserResponse): boolean {
		if (this.usersList.length <= 1) {
			return false;
		}

		// if row is current user, remove delete
		if (this.authenticationService.loggedInUserId == user.id) {
			return false;
		}

		// if current user is not a Primary Authorized User, prevent delete
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
						});
				}
			});
	}

	private loadListOfUsers(): void {
		this.orgUserService
			.apiOrgsOrgIdUsersGet({ orgId: this.authenticationService.loggedInOrgId! })
			.pipe()
			.subscribe((res: OrgUserListResponse) => {
				this.maximumNumberOfContacts = res.maximumNumberOfAuthorizedContacts ?? this.DEFAULT_MAX_NUMBER_OF_CONTACTS;
				this.maximumNumberOfPrimaryContacts =
					res.maximumNumberOfPrimaryAuthorizedContacts ?? this.DEFAULT_MAX_NUMBER_OF_PRIMARY_CONTACTS;

				this.usersList = res.users as Array<OrgUserResponse>;
				this.sortUsers();
				this.setFlags();
			});
	}

	private setFlags(): void {
		this.showAddArea = this.isUserPrimaryAuthorizedUser();
		this.isAllowedAddContact = this.usersList.length >= this.maximumNumberOfContacts ? false : true;

		const numberOfPrimary = this.usersList.filter(
			(user) => user.contactAuthorizationTypeCode == ContactAuthorizationTypeCode.Primary
		)?.length;
		this.isAllowedAddPrimary = numberOfPrimary >= this.maximumNumberOfPrimaryContacts ? false : true;
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
				}
			});
	}

	private isUserPrimaryAuthorizedUser(): boolean {
		if (!this.usersList) {
			return false;
		}

		const currUser = this.usersList.find((item) => item.id == this.authenticationService.loggedInUserId);
		return currUser ? currUser.contactAuthorizationTypeCode == ContactAuthorizationTypeCode.Primary : false;
	}
}
