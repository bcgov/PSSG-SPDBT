import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { EditUserModalComponent, UserDialogData } from './edit-user-modal.component';

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
					<button
						mat-flat-button
						class="large w-100 mb-2"
						style="background-color: var(--color-green); color: var(--color-white);"
						(click)="onAddUser()"
					>
						Add New User
					</button>
				</div>
			</div>

			<div class="row mt-4 mb-4">
				<div class="col-md-11 col-sm-12">
					<section class="px-4 py-2 mb-3 card-section">
						<div class="row mt-2">
							<div class="col-lg-3 col-md-3">
								<small class="d-block text-muted">Authorization Type</small>
								<strong> Primary Authorized Contact </strong>
							</div>
							<div class="col-lg-3 col-md-3">
								<small class="d-block text-muted mt-2 mt-md-0">Name</small>
								<strong> Surname, Given </strong>
							</div>
							<div class="col-lg-3 col-md-3">
								<small class="d-block text-muted mt-2 mt-md-0">Email</small>
								<strong> contact@email.com </strong>
							</div>
						</div>
						<mat-divider class="my-3"></mat-divider>
						<div class="row mb-2">
							<div class="col-lg-3 col-md-4">
								<small class="d-block text-muted">Phone Number</small>
								<strong>(250) 445-9898</strong>
							</div>
							<div class="col-lg-3 col-md-4">
								<small class="d-block text-muted mt-2 mt-md-0">Job Title</small>
								<strong>Teacher</strong>
							</div>
							<div class="col-lg-2 col-md-4">
								<small class="d-block text-muted mt-2 mt-md-0">Date of Birth</small>
								<strong>1980-Jan-13</strong>
							</div>
							<div class="col-lg-2 col-md-6">
								<button mat-stroked-button color="primary" class="large mt-2 mt-lg-0" (click)="onMaintainUser()">
									Edit
								</button>
							</div>
							<div class="col-lg-2 col-md-6">
								<button mat-flat-button color="warn" class="large mt-2 mt-lg-0" (click)="onDeleteUser()">Remove</button>
							</div>
						</div>
					</section>
				</div>
			</div>

			<div class="row">
				<div class="col-md-11 col-sm-12">
					<section class="px-4 py-2 mb-3 card-section">
						<div class="row mt-2">
							<div class="col-lg-3 col-md-3">
								<small class="d-block text-muted">Authorization Type</small>
								<strong> Primary Authorized Contact </strong>
							</div>
							<div class="col-lg-3 col-md-3">
								<small class="d-block text-muted mt-2 mt-md-0">Name</small>
								<strong> Surname, Given </strong>
							</div>
							<div class="col-lg-3 col-md-3">
								<small class="d-block text-muted mt-2 mt-md-0">Email</small>
								<strong> contact@email.com </strong>
							</div>
						</div>
						<mat-divider class="my-3"></mat-divider>
						<div class="row mb-2">
							<div class="col-lg-3 col-md-4">
								<small class="d-block text-muted">Phone Number</small>
								<strong>(250) 445-9898</strong>
							</div>
							<div class="col-lg-3 col-md-4">
								<small class="d-block text-muted mt-2 mt-md-0">Job Title</small>
								<strong>Teacher</strong>
							</div>
							<div class="col-lg-2 col-md-4">
								<small class="d-block text-muted mt-2 mt-md-0">Date of Birth</small>
								<strong>1980-Jan-13</strong>
							</div>
							<div class="col-lg-2 col-md-6">
								<button mat-stroked-button color="primary" class="large mt-2 mt-lg-0" (click)="onMaintainUser()">
									Edit
								</button>
							</div>
							<div class="col-lg-2 col-md-6">
								<button mat-flat-button color="warn" class="large mt-2 mt-lg-0" (click)="onDeleteUser()">Remove</button>
							</div>
						</div>
					</section>
				</div>
			</div>
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
	constructor(private dialog: MatDialog) {}

	onAddUser(): void {
		const dialogOptions: UserDialogData = {
			id: '',
			authorizationTypeCode: '',
			surname: '',
			givenName: '',
			email: '',
		};
		this.userDialog(dialogOptions);
	}

	onMaintainUser(): void {
		const dialogOptions: UserDialogData = {
			id: '123',
			authorizationTypeCode: 'Aaaa',
			surname: 'Smith',
			givenName: '',
			email: 'test@test.com',
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

	private userDialog(dialogOptions: UserDialogData): void {
		this.dialog
			.open(EditUserModalComponent, {
				width: '800px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((data) => {
				if (data) {
					console.log('dialog response', data);
				}
			});
	}
}
