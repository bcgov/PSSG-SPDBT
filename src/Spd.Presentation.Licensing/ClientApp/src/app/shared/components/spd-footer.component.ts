import { Component, OnInit } from '@angular/core';
import { ConfigurationResponse } from '@app/api/models';
import { ApplicationService } from '@app/core/services/application.service';
import { ConfigService } from '@app/core/services/config.service';

@Component({
	selector: 'app-spd-footer',
	template: `
		<mat-toolbar color="primary" class="no-print footer">
			<a tabindex="0" (click)="goHome()" (keydown)="onKeydownGoHome($event)"> Home </a>
			<a href="https://www2.gov.bc.ca/gov/content/home/disclaimer">Disclaimer</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/privacy">Privacy</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/accessibility">Accessibility</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/copyright">Copyright</a>
			<a href="https://www2.gov.bc.ca/gov/content/home/get-help-with-government-services">Contact Us</a>

			<span style="flex: 1 1 auto;"></span>

			<span class="fs-7 p-2 text-env" *ngIf="env">{{ env }}</span>
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

			.text-env {
				color: #6c757d !important;
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
export class SpdFooterComponent implements OnInit {
	env: string | null | undefined = null;

	constructor(
		private commonApplicationService: ApplicationService,
		private configService: ConfigService
	) {}

	ngOnInit(): void {
		this.configService.getConfigs().subscribe((config: ConfigurationResponse) => {
			if (this.configService.isProduction()) {
				this.env = config.version ?? null;
			} else {
				this.env = `${config.environment ?? ''} ${config.version ?? ''}`;
			}
		});
	}

	goHome(): void {
		this.commonApplicationService.onGoToHome();
	}

	onKeydownGoHome(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.goHome();
	}
}
