import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserInfoMsgTypeCode } from 'src/app/api/models';

@Component({
    selector: 'app-access-denied',
    template: `
		<div class="container-fluid text-center mt-4">
		  @switch (userInfoMsgType) {
		    @case (userInfoMsgTypeCodes.RegistrationDenied) {
		      <mat-icon class="my-4">unpublished</mat-icon>
		      <h2 class="my-4">Your organization’s registration request was denied</h2>
		      <p class="my-4">
		        Visit
		        <a href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check">SPD webpage</a>
		        for more information about the Criminal Records Review Program
		      </p>
		    }
		    @case (userInfoMsgTypeCodes.AccountNotMatchRecord) {
		      <mat-icon class="my-4">person_off</mat-icon>
		      <h2 class="my-4">Your account doesn't match our records</h2>
		      <p class="my-4">
		        Visit
		        <a href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check">SPD webpage</a>
		        to learn more or register for the Criminal Records Review Program
		      </p>
		    }
		    @case (userInfoMsgTypeCodes.NoActiveAccountForOrg) {
		      <mat-icon class="my-4">no_accounts</mat-icon>
		      <h2 class="my-4">You don't have an active account with this organization</h2>
		      <p class="my-4">
		        Please contact the primary authorized contact in your organization to get access to the portal
		      </p>
		    }
		    @default {
		      @if (errorMessage) {
		        <mat-icon class="my-4">do_not_disturb</mat-icon>
		        <h2 class="my-4">Access Denied</h2>
		        <p class="fs-5 my-4">{{ errorMessage }}</p>
		      } @else {
		        <mat-icon class="my-4">do_not_disturb</mat-icon>
		        <h2 class="my-4">Access Denied</h2>
		        <p class="fs-5 my-4">You currently do not have permission to access this page.</p>
		      }
		    }
		  }
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
    standalone: false
})
export class AccessDeniedComponent implements OnInit {
	errorMessage: string | null = null;
	userInfoMsgType: UserInfoMsgTypeCode | null = null;
	userInfoMsgTypeCodes = UserInfoMsgTypeCode;

	constructor(private location: Location) {}

	ngOnInit(): void {
		this.userInfoMsgType = (this.location.getState() as any).userInfoMsgType;
		this.errorMessage = (this.location.getState() as any).errorMessage;
	}
}
