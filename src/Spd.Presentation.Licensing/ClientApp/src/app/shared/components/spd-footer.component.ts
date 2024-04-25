import { Component } from '@angular/core';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';

@Component({
	selector: 'app-spd-footer',
	template: `
		<mat-toolbar color="primary" class="no-print footer">
			<a tabindex="0" (click)="goHome()" (keydown)="onKeydownGoHome($event)"> Home </a>
			<a href="https://www2.gov.bc.ca/gov/content/home/disclaimer" target="_blank">Disclaimer</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/privacy" target="_blank">Privacy</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/accessibility" target="_blank">Accessibility</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/copyright" target="_blank">Copyright</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/get-help-with-government-services" target="_blank">Contact Us</a>
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

			@media print {
				.no-print,
				.no-print * {
					display: none !important;
				}

				.print-only {
					display: block;
				}
			}
		`,
	],
})
export class SpdFooterComponent {
	constructor(private commonApplicationService: CommonApplicationService) {}

	goHome(): void {
		this.commonApplicationService.onGoToHome();
	}

	onKeydownGoHome(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.goHome();
	}
}
