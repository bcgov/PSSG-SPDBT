import { Component } from '@angular/core';

@Component({
	selector: 'app-footer',
	template: `
		<div class="footer">
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
		</div>
	`,
	styles: [
		`
			.footer {
				width: 100%;
				position: fixed;
				bottom: 0;
				z-index: 9999;
			}

			.divider {
				padding-left: 10px;
				padding-right: 10px;
			}

			a {
				color: white;
				font-size: smaller;
			}
		`,
	],
})
export class FooterComponent {}
