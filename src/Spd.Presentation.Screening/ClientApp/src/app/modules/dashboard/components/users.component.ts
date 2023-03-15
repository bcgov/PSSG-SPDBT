import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { OrgUserResponse } from 'src/app/api/models';
import { OrgUserService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { ContactAuthorizationTypes, MaintainUserModalComponent, UserDialogData } from './maintain-user-modal.component';

@Component({
	selector: 'app-users',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-4 p-md-4 p-sm-0">
			<div class="row">
				<div class="col-xl-9 col-lg-8 col-md-7 col-sm-12">
					<h2 class="mb-2 fw-normal">
						Manage Authorized Users <mat-icon (click)="manageUsersInfo()">info</mat-icon>
						<div class="mt-2 fs-5 fw-light">
							Your organization must have one primary authorized contact, and may have up to five other authorized
							contacts.
						</div>
					</h2>
				</div>
				<div class="col-xl-2 col-lg-3 col-md-4 col-sm-12 my-auto">
					<ng-container *ngIf="addAllowed; else addNotAllowed">
						<button mat-flat-button color="primary" class="large w-100 mb-2" (click)="onAddUser()">Add User</button>
					</ng-container>
					<ng-template #addNotAllowed>
						<div class="alert alert-warning d-flex align-items-center" role="alert">
							<div>A maximum of {{ MAX_NUMBER_OF_USERS }} authorized users is allowed</div>
						</div>
					</ng-template>
				</div>
			</div>
			<ng-container *ngFor="let user of usersList; let i = index">
				<div class="row mt-2 mb-2">
					<div class="col-md-11 col-sm-12">
						<section class="px-4 py-2 mb-3 card-section">
							<div class="row mt-2">
								<div class="col-lg-10 col-sm-12">
									<div class="row">
										<div class="col-lg-1 col-md-1 col-sm-10">
											<span class="badge rounded-pill bg-success">
												{{ i + 1 }}
											</span>
										</div>
										<div class="col-lg-3 col-md-3">
											<small class="d-block text-muted">Authorization Type</small>
											<strong> {{ getDesc(user.contactAuthorizationTypeCode) | default }} </strong>
										</div>
										<div class="col-lg-3 col-md-3">
											<small class="d-block text-muted mt-2 mt-md-0">Name</small>
											<strong> {{ user | fullname | default }} </strong>
										</div>
										<div class="col-lg-5 col-md-3">
											<small class="d-block text-muted mt-2 mt-md-0">Email</small>
											<strong> {{ user.email | default }} </strong>
										</div>
									</div>
									<mat-divider class="my-3"></mat-divider>
									<div class="row mb-2">
										<div class="col-lg-1 col-md-1 col-sm-10"></div>
										<div class="col-lg-3 col-md-3">
											<small class="d-block text-muted">Phone Number</small>
											<strong>{{ user.phoneNumber + '' | mask : appConstants.phone.displayMask | default }}</strong>
										</div>
										<div class="col-lg-3 col-md-3">
											<small class="d-block text-muted mt-2 mt-md-0">Job Title</small>
											<strong>{{ user.jobTitle | default }}</strong>
										</div>
										<div class="col-lg-3 col-md-4">
											<small class="d-block text-muted mt-2 mt-md-0">Date of Birth</small>
											<strong>{{ user.dateOfBirth | date : appConstants.date.dateFormat | default }}</strong>
										</div>
									</div>
								</div>
								<div class="col-lg-2 col-sm-12">
									<button
										mat-stroked-button
										color="primary"
										class="large mt-2 mb-2 mt-lg-0"
										(click)="onMaintainUser(user)"
									>
										Edit
									</button>
									<button
										mat-stroked-button
										color="warn"
										class="large mt-2 mt-lg-0"
										*ngIf="allowDeleteRow(user)"
										(click)="onDeleteUser(user)"
									>
										Remove
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
	title: string = '';
	appConstants = SPD_CONSTANTS;
	readonly MAX_NUMBER_OF_USERS = 6;
	phoneMask = SPD_CONSTANTS.phone.displayMask;
	authorizationTypes = ContactAuthorizationTypes;

	addAllowed = false;
	startAt = SPD_CONSTANTS.date.birthDateStartAt;
	matcher = new FormErrorStateMatcher();

	form = this.formBuilder.group({
		users: this.formBuilder.array([]),
	});

	usersList: OrgUserResponse[] = [];

	constructor(
		private dialog: MatDialog,
		private formBuilder: FormBuilder,
		private orgUserService: OrgUserService,
		private hotToast: HotToastService
	) {}

	ngOnInit(): void {
		this.setAllowedToAdd();
		//TODO replace with proper org id
		this.orgUserService
			.apiOrgUsersOrganizationIdGet({ organizationId: '4165bdfe-7cb4-ed11-b83e-00505683fbf4' })
			.pipe()
			.subscribe((res: Array<OrgUserResponse>) => {
				this.usersList = res;
			});
	}

	onAddUser(): void {
		const newUser: OrgUserResponse = { dateOfBirth: null };
		const dialogOptions: UserDialogData = {
			user: newUser,
		};
		this.userDialog(dialogOptions, true);
	}

	onMaintainUser(user: OrgUserResponse): void {
		const dialogOptions: UserDialogData = {
			user,
		};
		this.userDialog(dialogOptions, false);
	}

	onDeleteUser(user: OrgUserResponse) {
		const data: DialogOptions = {
			icon: 'error_outline',
			title: 'Delete User',
			message: 'Are you sure you want to permanently delete this user?',
			actionText: 'Yes, delete this user',
			cancelText: 'Go back',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.orgUserService
						.apiOrgUserUserIdDelete({ userId: user.id! })
						.pipe()
						.subscribe((_res) => {
							this.hotToast.success('User was successfully deleted');
						});
				}
			});
	}

	private setAllowedToAdd(): void {
		this.addAllowed = this.usersList.length >= this.MAX_NUMBER_OF_USERS ? false : true;
	}

	private userDialog(dialogOptions: UserDialogData, isCreate: boolean): void {
		this.dialog
			.open(MaintainUserModalComponent, {
				width: '800px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((res) => {
				if (res) {
					if (isCreate) {
						// Add new user
						this.usersList.push(res.data);
						this.hotToast.success('User was successfully added');
					} else {
						// Update user info
						this.hotToast.success('User was successfully updated');
					}
					this.setAllowedToAdd();
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
		const message = `<strong>Primary Authorized Users</strong>
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
}
