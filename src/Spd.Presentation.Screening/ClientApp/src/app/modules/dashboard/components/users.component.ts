import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { MaintainUserModalComponent, UserDialogData } from './maintain-user-modal.component';

export class UserModel {
	id: number | null = null;
	authorizationType: string = '';
	surname: string = '';
	givenName: string = '';
	email: string = '';
	phoneNumber: string = '';
	jobTitle: string = '';
	dateOfBirth: string = '';
}

@Component({
	selector: 'app-users',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-4 p-md-4 p-sm-0">
			<div class="row">
				<div class="col-lg-8 col-md-7 col-sm-12">
					<h2 class="mb-2 fw-normal">
						Manage Authorized Users
						<div class="mt-2 fs-5 fw-light">
							Your organization must have one primary authorized contact, and may have up to five other authorized
							contacts.
						</div>
					</h2>
				</div>
				<div class="col-lg-3 col-md-4 col-sm-12 my-auto">
					<ng-container *ngIf="addAllowed; else addNotAllowed">
						<button mat-flat-button color="primary" class="large w-100 mb-2" (click)="onAddUser()">Add New User</button>
					</ng-container>
					<ng-template #addNotAllowed>
						<div class="alert alert-warning d-flex align-items-center" role="alert">
							<div>A maximum of {{ MAX_NUMBER_OF_USERS }} authorized users is allowed</div>
						</div>
					</ng-template>
				</div>
			</div>

			<ng-container *ngFor="let user of users; let i = index">
				<div class="row mt-2 mb-2">
					<div class="col-md-11 col-sm-12">
						<section class="px-4 py-2 mb-3 card-section">
							<div class="row mt-2">
								<div class="col-lg-3 col-md-3">
									<small class="d-block text-muted">Authorization Type</small>
									<strong> {{ user.authorizationType }} </strong>
								</div>
								<div class="col-lg-3 col-md-3">
									<small class="d-block text-muted mt-2 mt-md-0">Name</small>
									<strong> {{ user.givenName }} {{ user.surname }} </strong>
								</div>
								<div class="col-lg-3 col-md-3">
									<small class="d-block text-muted mt-2 mt-md-0">Email</small>
									<strong> {{ user.email }} </strong>
								</div>
								<div class="col-lg-3 col-md-12 position-relative">
									<span
										class="position-absolute translate-middle badge rounded-pill bg-danger"
										style="top: -16px;right: -28px;"
									>
										{{ i + 1 }}
									</span>
								</div>
							</div>
							<mat-divider class="my-3"></mat-divider>
							<div class="row mb-2">
								<div class="col-lg-3 col-md-4">
									<small class="d-block text-muted">Phone Number</small>
									<strong>{{ user.phoneNumber | mask : appConstants.phone.displayMask }}</strong>
								</div>
								<div class="col-lg-3 col-md-4">
									<small class="d-block text-muted mt-2 mt-md-0">Job Title</small>
									<strong>{{ user.jobTitle }}</strong>
								</div>
								<div class="col-lg-2 col-md-4">
									<small class="d-block text-muted mt-2 mt-md-0">Date of Birth</small>
									<strong>{{ user.dateOfBirth | date : appConstants.date.dateFormat }}</strong>
								</div>
								<div class="col-lg-2 col-md-6">
									<button mat-stroked-button color="primary" class="large mt-2 mt-lg-0" (click)="onMaintainUser()">
										Edit
									</button>
								</div>
								<div class="col-lg-2 col-md-6">
									<button mat-stroked-button color="warn" class="large mt-2 mt-lg-0" (click)="onDeleteUser()">
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
				border-left: 3px solid var(--color-primary);
				border-bottom-width: 1px;
				border-bottom-style: solid;
				border-bottom-color: rgba(0, 0, 0, 0.12);
			}
		`,
	],
})
export class UsersComponent {
	appConstants = SPD_CONSTANTS;
	readonly MAX_NUMBER_OF_USERS = 6;
	addAllowed = false;

	users: UserModel[] = [
		{
			id: 1,
			authorizationType: 'Primary Authorized Contact',
			surname: 'Surname',
			givenName: 'Given',
			email: 'contact@email.com',
			phoneNumber: '2506648787',
			jobTitle: 'Teacher',
			dateOfBirth: '2002-02-04T00:10:05.865Z',
		},
		{
			id: 2,
			authorizationType: 'Primary Authorized Contact',
			surname: 'Surname',
			givenName: 'Given',
			email: 'contact@email.com',
			phoneNumber: '2508851234',
			jobTitle: 'Teacher',
			dateOfBirth: '2002-07-04T00:10:05.865Z',
		},
	];

	constructor(private dialog: MatDialog) {}

	ngOnInit(): void {
		this.setAllowedToAdd();
	}

	onAddUser(): void {
		const newUser: UserModel = {
			id: null,
			authorizationType: '',
			surname: '',
			givenName: '',
			email: '',
			phoneNumber: '',
			jobTitle: '',
			dateOfBirth: '',
		};

		const dialogOptions: UserDialogData = {
			user: newUser,
		};
		this.userDialog(dialogOptions);
	}

	onMaintainUser(): void {
		const editUser: UserModel = {
			id: 123,
			authorizationType: 'Primary Authorized Contact',
			surname: 'Surname',
			givenName: 'Given',
			email: 'contact@email.com',
			phoneNumber: '2503851535',
			jobTitle: 'Teacher',
			dateOfBirth: '2002-07-04T00:10:05.865Z',
		};

		const dialogOptions: UserDialogData = {
			user: editUser,
		};

		this.userDialog(dialogOptions);
	}

	onDeleteUser() {
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
				}
			});
	}

	private setAllowedToAdd(): void {
		this.addAllowed = this.users.length >= this.MAX_NUMBER_OF_USERS ? false : true;
	}

	private userDialog(dialogOptions: UserDialogData): void {
		this.dialog
			.open(MaintainUserModalComponent, {
				width: '800px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((res) => {
				if (res) {
					this.users.push(res.data);
					this.setAllowedToAdd();
				}
			});
	}
}
