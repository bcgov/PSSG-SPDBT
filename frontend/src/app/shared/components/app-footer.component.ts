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

			.site-footer {
				background-color: #003366;
				width: 100%;
				min-height: 60px;
				padding: 20px 0;
				border-top: 2px solid theme-palette(yellow);
			}

			.site-footer-links {
				list-style: none;
				margin-bottom: 0;
				margin-left: 0;
			}

			.site-footer-links li {
				margin-bottom: 16px;

				&:first-child {
					margin-left: 0;
				}
			}

			.site-footer-links a {
				font-size: 1em;
				color: #fff !important;
				font-weight: 200;
			}
			.divider {
				color: #fff;
				display: none;
			}

			@media (min-width: 768px) {
				.divider {
					display: inline-block;
				}
			}

			@media (min-width: 768px) {
				.site-footer-links {
					display: -webkit-box;
					display: -ms-flexbox;
					display: flex;
					list-style: none;
					-webkit-box-pack: justify;
					-ms-flex-pack: justify;
					// justify-content: space-between;
				}

				.site-footer-links li {
					margin-bottom: 0;
					margin-left: 1em;
					margin-right: 1em;
				}
			}
		`,
	],
})
export class FooterComponent {}
