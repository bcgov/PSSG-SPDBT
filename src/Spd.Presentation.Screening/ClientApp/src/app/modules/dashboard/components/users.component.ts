import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { ContactAuthorizationTypeCode, OrgUserListResponse, OrgUserResponse } from 'src/app/api/models';
import { OrgUserService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { ContactAuthorizationTypes, MaintainUserModalComponent, UserDialogData } from './maintain-user-modal.component';

@Component({
	selector: 'app-users',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-8 col-md-7 col-sm-12">
					<h2 class="mb-2 fw-normal">
						User Management <mat-icon (click)="manageUsersInfo()">info</mat-icon>
						<div class="mt-2 fs-5 fw-light">
							Your organization may have up to {{ maximumNumberOfPrimaryContacts }} primary authorized contacts and up
							to {{ maximumNumberOfContacts }} authorized contacts
						</div>
					</h2>
				</div>
				<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 my-auto" *ngIf="showAddArea">
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
					<div class="col-md-11 col-sm-12">
						<section class="px-4 py-2 mb-3 card-section">
							<div class="row mt-2">
								<div class="col-xl-10 col-lg-10 col-sm-12">
									<div class="row">
										<div class="col-xl-1 col-lg-1 col-md-1 col-sm-10">
											<span class="badge rounded-pill bg-success">
												{{ i + 1 }}
											</span>
										</div>
										<div class="col-xl-4 col-lg-4 col-md-3">
											<small class="d-block text-muted">Authorization Type</small>
											<strong> {{ getDesc(user.contactAuthorizationTypeCode) | default }} </strong>
										</div>
										<div class="col-xl-4 col-lg-4 col-md-3">
											<small class="d-block text-muted mt-2 mt-md-0">Name</small>
											<strong> {{ user | fullname | default }} </strong>
										</div>
										<div class="col-xl-3 col-lg-3 col-md-3">
											<small class="d-block text-muted mt-2 mt-md-0">Email</small>
											<strong> {{ user.email | default }} </strong>
										</div>
									</div>
									<mat-divider class="my-3"></mat-divider>
									<div class="row mb-2">
										<div class="col-xl-1 col-lg-1 col-md-1 col-sm-10"></div>
										<div class="col-xl-4 col-lg-4 col-md-3">
											<small class="d-block text-muted">Phone Number</small>
											<strong>{{ user.phoneNumber || '' | mask : appConstants.phone.displayMask | default }}</strong>
										</div>
										<div class="col-xl-4 col-lg-4 col-md-3">
											<small class="d-block text-muted mt-2 mt-md-0">Job Title</small>
											<strong>{{ user.jobTitle | default }}</strong>
										</div>
										<div class="col-xl-3 col-lg-3 col-md-4">
											<small class="d-block text-muted mt-2 mt-md-0">Date of Birth</small>
											<strong>{{ user.dateOfBirth | date : appConstants.date.dateFormat | default }}</strong>
										</div>
									</div>
								</div>
								<div class="col-xl-2 col-lg-2 col-sm-12 mx-auto">
									<button
										mat-mini-fab
										matTooltip="Edit user"
										class="m-2"
										(click)="onMaintainUser(user)"
										aria-label="Edit user"
									>
										<mat-icon>edit</mat-icon>
									</button>
									<button
										mat-mini-fab
										matTooltip="Remove user"
										class="m-2"
										*ngIf="allowDeleteRow(user)"
										(click)="onDeleteUser(user)"
										aria-label="Remove user"
									>
										<mat-icon>delete_outline</mat-icon>
									</button>
								</div>
							</div>
						</section>
					</div>
				</div>
			</ng-container>
		</section>
	`,
	styles: [
		`
			h4,
			.mat-icon {
				color: var(--color-primary-light);
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
export class UsersComponent {
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

	constructor(private dialog: MatDialog, private orgUserService: OrgUserService, private hotToast: HotToastService) {}

	ngOnInit(): void {
		this.loadListOfUsers();
	}

	onAddUser(): void {
		const newUser: OrgUserResponse = { dateOfBirth: null };
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
		const data: DialogOptions = {
			icon: 'error_outline',
			title: 'Delete User',
			message: 'Are you sure you want to permanently remove this user?',
			actionText: 'Yes, remove this user',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.orgUserService
						.apiOrgsOrgIdUsersUserIdDelete({ userId: user.id!, orgId: user.organizationId! })
						.pipe()
						.subscribe((_res) => {
							this.usersList.splice(
								this.usersList.findIndex((item) => item.id == user.id!),
								1
							);
							this.setFlags();
							this.hotToast.success('User was successfully removed');
						});
				}
			});
	}

	allowDeleteRow(user: OrgUserResponse): boolean {
		// TODO if row is current user, remove delete

		// TODO if current user is not a Primary Authorized User, prevent delete
		return true;
	}

	manageUsersInfo(): void {
		const title = 'What can authorized users do?';
		const message = `
		<strong>Primary Authorized Users</strong>
		<ul>
		<li>Add or remove others in their organization from the authorized contact roles</li>		
		<li>Transfer their primary authority to another additional authorized contact</li>		
		<li>Edit and update organization information</li>		
		<li>Initiate new screenings</li>		
		<li>View screenings statuses</li>		
		<li>View expiring screenings</li>		
		<li>View financial information and pay for screenings</li>		
		</ul>
		<strong>Authorized Users</strong>
		<ul>
		<li>Initiate new screenings</li>
		<li>View screenings statuses</li>
		<li>View expiring screenings</li>
		<li>View financial information and pay for screenings</li>
		</ul>
		`;

		const dialogOptions: DialogOptions = {
			icon: 'info',
			type: 'info',
			title,
			message,
			cancelText: 'Close',
		};

		this.dialog.open(DialogComponent, { data: dialogOptions });
	}

	getDesc(val: string | undefined): string | null {
		if (!val) return null;

		const find = this.authorizationTypes.find((element) => element.code == val);
		if (find) return find.desc;
		return null;
	}

	private sortUsers(): void {
		this.usersList.sort((a: OrgUserResponse, b: OrgUserResponse) => {
			const aa = a.contactAuthorizationTypeCode?.toString() ?? '';
			const bb = b.contactAuthorizationTypeCode?.toString() ?? '';
			const cc = a.firstName?.toUpperCase() ?? '';
			const dd = b.firstName?.toUpperCase() ?? '';
			const ee = a.lastName?.toUpperCase() ?? '';
			const ff = b.lastName?.toUpperCase() ?? '';
			return aa.localeCompare(bb) * -1 || cc.localeCompare(dd) || ee.localeCompare(ff);
		});
	}

	private loadListOfUsers(): void {
		//TODO replace with proper org id
		this.orgUserService
			.apiOrgsOrgIdUsersGet({ orgId: '4165bdfe-7cb4-ed11-b83e-00505683fbf4' })
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
		this.showAddArea = true;
		this.isAllowedAddContact = this.usersList.length >= this.maximumNumberOfContacts ? false : true;

		const numberOfPrimary = this.usersList.filter(
			(user) => user.contactAuthorizationTypeCode == ContactAuthorizationTypeCode.Primary
		)?.length;
		this.isAllowedAddPrimary = numberOfPrimary >= this.maximumNumberOfPrimaryContacts ? false : true;
	}

	private userDialog(dialogOptions: UserDialogData, isCreate: boolean): void {
		this.dialog
			.open(MaintainUserModalComponent, {
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
}
