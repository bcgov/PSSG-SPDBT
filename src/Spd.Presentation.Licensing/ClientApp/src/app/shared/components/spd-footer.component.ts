import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';

@Component({
	selector: 'app-spd-footer',
	template: `
		<mat-toolbar color="primary" class="footer">
			<a tabindex="0" (click)="goHome()" (keydown)="onKeydownGoHome($event)"> Home </a>
			<a href="https://www2.gov.bc.ca/gov/content/home/disclaimer">Disclaimer</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/privacy">Privacy</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/accessibility">Accessibility</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/copyright">Copyright</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/get-help-with-government-services">Contact Us</a>
		</mat-toolbar>
	`,
	styles: [
		`
			.footer {
				border-top: 2px solid var(--color-yellow);
			}

			a {
				padding-left: 10px;
				padding-right: 10px;
				color: white;
				font-size: smaller;
				text-decoration: none !important;
			}

			@media (max-width: 575px) {
				.mat-toolbar-row,
				.mat-toolbar-single-row {
					display: block;
					height: unset;
				}

				a {
					display: block;
					padding: 3px;
				}
			}
		`,
	],
})
export class SpdFooterComponent {
	constructor(private router: Router) {}

	goHome(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LOGIN_SELECTION));
	}

	onKeydownGoHome(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.goHome();
	}
}
