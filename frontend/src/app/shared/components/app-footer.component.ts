import { Component } from '@angular/core';

@Component({
	selector: 'app-footer',
	template: `
		<mat-toolbar color="primary">
			<a href="/">Home</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/disclaimer">Disclaimer</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/privacy">Privacy</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/accessibility">Accessibility</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/copyright">Copyright</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/get-help-with-government-services">Contact Us</a>
		</mat-toolbar>
	`,
	styles: [
		`
			.divider {
				padding-left: 10px;
				padding-right: 10px;
			}

			a {
				padding-left: 10px;
				padding-right: 10px;
				color: white;
				font-size: smaller;
			}

			@media (max-width: 575px) {
				.mat-toolbar-row,
				.mat-toolbar-single-row {
					display: block;
					height: unset;
				}

				a {
					display: block;
					padding: 6px;
				}
			}
		`,
	],
})
export class FooterComponent {}
