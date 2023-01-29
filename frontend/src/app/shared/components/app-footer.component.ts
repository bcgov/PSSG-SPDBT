import { Component } from '@angular/core';

@Component({
	selector: 'app-footer',
	template: `
		<mat-toolbar color="primary">
			<a href="/">Home</a>
			<span class="divider">|</span>
			<a href="https://www2.gov.bc.ca/gov/content/home/disclaimer">Disclaimer</a>
			<span class="divider">|</span>
			<a href="https://www2.gov.bc.ca/gov/content/home/privacy">Privacy</a>
			<span class="divider">|</span>
			<a href="https://www2.gov.bc.ca/gov/content/home/accessibility">Accessibility</a>
			<span class="divider">|</span>
			<a href="https://www2.gov.bc.ca/gov/content/home/copyright">Copyright</a>
			<span class="divider">|</span>
			<a href="https://www2.gov.bc.ca/gov/content/home/get-help-with-government-services">Contact Us</a>
			<span class="divider"></span>
		</mat-toolbar>
	`,
	styles: [
		`
			.divider {
				padding-left: 10px;
				padding-right: 10px;
			}

			a {
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

				.divider {
					display: none;
				}
			}
		`,
	],
})
export class FooterComponent {}
