import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
	selector: 'app-header',
	template: `
		<mat-toolbar color="primary" class="header">
			<span>
				<img
					src="assets/gov_bc_logo_blue.png"
					alt="Government of BC Logo"
					class="gov-bc-logo"
					(click)="goToLanding()"
				/>
			</span>
			<mat-divider vertical class="header-divider mx-3"></mat-divider>
			<div class="header-text pl-3" (click)="goToLanding()">{{ title }}</div>
			<span style="flex: 1 1 auto;"></span>
			<div *ngIf="loggedInUserDisplay">
				<mat-icon class="logout-button me-2" (click)="onLogout()">logout</mat-icon>{{ loggedInUserDisplay }}
			</div>
		</mat-toolbar>
	`,
	styles: [
		`
			.mat-toolbar-row,
			.mat-toolbar-single-row {
				height: 74px;
			}

			.gov-bc-logo {
				padding-bottom: 12px;
				cursor: pointer;
			}

			.header {
				border-bottom: 2px solid var(--color-yellow);
				box-shadow: 0px 5px 10px 0px rgb(169 169 169);
			}

			.header-text {
				white-space: normal;
				font-size: 1.3rem;
				cursor: pointer;
				line-height: 20px;
			}

			.header-divider {
				height: 70%;
				border-right-color: gray;
			}

			.logout-button {
				vertical-align: middle;
				cursor: pointer;
			}
		`,
	],
})
export class HeaderComponent {
	@Input() title = '';
	loggedInUserDisplay: string | null = null;

	constructor(protected router: Router, private authenticationService: AuthenticationService) {}

	ngOnInit(): void {
		this.authenticationService.isLoginSubject$.subscribe((subjectData: any) => {
			this.getUserInfo();
		});
	}

	goToLanding(): void {
		this.router.navigate(['/']);
	}

	onLogout(): void {
		this.authenticationService.logout();
	}

	private getUserInfo(): void {
		const loggedInUserData = this.authenticationService.loggedInUserData;
		this.loggedInUserDisplay = loggedInUserData ? loggedInUserData.display_name : null;
	}
}
