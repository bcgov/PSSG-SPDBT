import { Component } from '@angular/core';

@Component({
	selector: 'app-header',
	template: `
		<mat-toolbar color="primary" class="header-border">
			<span>
				<img src="/assets/gov_bc_logo_blue.png" alt="Government of BC Logo" style="padding-bottom: 12px;" />
			</span>
			<mat-divider vertical class="pl-3" style="height: 70%; border-right-color: gray;"></mat-divider>
			<div class="heading pl-3">Organization Registration</div>
			<span class="flex-fill"></span>

			<!-- <span *ngIf="username && !isMobile"
        class="username">
    {{ username }}
  </span>
  <span *ngIf="username"
        class="logout">
    <mat-icon (click)="onLogout()">logout</mat-icon>
  </span> -->
		</mat-toolbar>
	`,
	styles: [
		`
			.mat-toolbar-row,
			.mat-toolbar-single-row {
				height: 74px;
			}

			.heading {
				font-size: 1.3rem;
				font-weight: 300;
			}
		`,
	],
})
export class HeaderComponent {}
