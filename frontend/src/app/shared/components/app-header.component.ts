import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-header',
	template: `
		<mat-toolbar color="primary" class="header">
			<span>
				<img src="assets/gov_bc_logo_blue.png" alt="Government of BC Logo" style="padding-bottom: 12px;" />
			</span>
			<mat-divider vertical class="mx-3" style="height: 70%; border-right-color: gray;"></mat-divider>
			<div class="heading pl-3">{{ title }}</div>
		</mat-toolbar>
	`,
	styles: [
		`
			.header {
				border-bottom: 3px solid var(--color-yellow);
			}

			.mat-toolbar-row,
			.mat-toolbar-single-row {
				height: 74px;
			}

			.heading {
				white-space: normal;
				font-size: 1.3rem;
				font-weight: 300;
			}
		`,
	],
})
export class HeaderComponent {
	@Input() title = '';
}
