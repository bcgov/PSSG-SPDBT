import { Component, OnInit } from '@angular/core';
import { ConfigurationResponse } from 'src/app/api/models';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
	selector: 'app-footer',
	template: `
		<mat-toolbar color="primary" class="footer">
			<a href="/">Home</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/disclaimer">Disclaimer</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/privacy">Privacy</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/accessibility">Accessibility</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/copyright">Copyright</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/get-help-with-government-services">Contact Us</a>

			<span style="flex: 1 1 auto;"></span>

			<span class="fs-7 p-2 text-muted" *ngIf="env">{{ env }}</span>
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
export class FooterComponent implements OnInit {
	env: string | null | undefined = null;

	constructor(private configService: ConfigService) {}

	ngOnInit(): void {
		this.configService.getConfigs().subscribe((config: ConfigurationResponse) => {
			if (this.configService.isProduction()) {
				this.env = config.version ?? null;
			} else {
				this.env = `${config.environment ?? ''} ${config.version ?? ''}`;
			}
		});
	}
}
