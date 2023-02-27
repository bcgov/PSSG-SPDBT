import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

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
		`,
	],
})
export class HeaderComponent {
	@Input() title = '';

	constructor(protected router: Router) {}

	goToLanding(): void {
		this.router.navigate(['/']);
	}
}
