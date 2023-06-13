import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserInfoMsgTypeCode } from 'src/app/api/models';

@Component({
	selector: 'app-access-denied',
	template: `
		<div class="container-fluid text-center mt-4">
			<ng-container [ngSwitch]="userInfoMsgType">
				<ng-container *ngSwitchCase="userInfoMsgTypeCodes.RegistrationNotApproved">
					<mat-icon>unpublished</mat-icon>
					<h2 class="my-4">Your organization’s registration request was not approved</h2>
					<p class="my-4">
						Visit
						<a href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check">SPD webpage</a>
						for more information about the Criminal Records Review Program
					</p>
					<button mat-flat-button color="primary" class="large my-2" style="width: 12em;">Back</button>
				</ng-container>
				<ng-container *ngSwitchCase="userInfoMsgTypeCodes.AccountNotMatchRecord">
					<mat-icon>person_off</mat-icon>
					<h2 class="my-4">Your account doesn't match our records</h2>
					<p class="my-4">
						Visit
						<a href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check">SPD webpage</a>
						to learn more or register for the Criminal Records Review Program
					</p>
					<button mat-flat-button color="primary" class="large my-2" style="width: 12em;">Back</button>
				</ng-container>
				<ng-container *ngSwitchCase="userInfoMsgTypeCodes.NoActiveAccountForOrg">
					<mat-icon>no_accounts</mat-icon>
					<h2 class="my-4">You don't have an active account with this organization</h2>
					<p class="my-4">
						Please contact the primary authorized contact in your organization to get access to the portal
					</p>
					<button mat-flat-button color="primary" class="large my-2" style="width: 12em;">Back</button>
				</ng-container>
				<ng-container *ngSwitchDefault>
					<mat-icon>do_not_disturb</mat-icon>
					<h2 class="my-4">Access Denied</h2>
					<p class="fs-5 my-4">You currently do not have permission to access this page.</p>
				</ng-container>
			</ng-container>
		</div>
	`,
	styles: [
		`
			.mat-icon {
				font-size: 80px;
				width: 80px;
				height: 80px;
				vertical-align: bottom;
				margin-right: 4px;
			}
		`,
	],
})
export class AccessDeniedComponent implements OnInit {
	userInfoMsgType: UserInfoMsgTypeCode | null = null;
	userInfoMsgTypeCodes = UserInfoMsgTypeCode;

	constructor(private location: Location) {}

	ngOnInit(): void {
		this.userInfoMsgType = (this.location.getState() as any).userInfoMsgType;
	}
}
