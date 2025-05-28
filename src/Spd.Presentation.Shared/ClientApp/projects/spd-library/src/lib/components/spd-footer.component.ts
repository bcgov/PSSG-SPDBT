import { Component, OnInit } from '@angular/core';
import { ConfigurationResponse } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { ConfigService } from '@app/core/services/config.service';

@Component({
	selector: 'app-spd-footer',
	template: `
		<mat-toolbar color="primary" class="no-print footer">
			<a aria-label="Navigate to home page" tabindex="0" (click)="goHome()" (keydown)="onKeydownGoHome($event)">
				Home
			</a>
			<a aria-label="Navigate to disclaimer page" [href]="bcGovDisclaimerUrl">Disclaimer</a>
			<a aria-label="Navigate to privacy page" [href]="bcGovPrivacyUrl">Privacy</a>
			<a aria-label="Navigate to accessibility page" [href]="bcGovAccessibilityUrl">Accessibility</a>
			<a aria-label="Navigate to copyright page" [href]="bcGovCopyrightUrl">Copyright</a>
			<a aria-label="Navigate to contact us page" [href]="bcGovContactUrl">Contact Us</a>

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
	standalone: false,
})
export class SpdFooterComponent implements OnInit {
	bcGovPrivacyUrl = SPD_CONSTANTS.urls.bcGovPrivacyUrl;
	bcGovDisclaimerUrl = SPD_CONSTANTS.urls.bcGovDisclaimerUrl;
	bcGovAccessibilityUrl = SPD_CONSTANTS.urls.bcGovAccessibilityUrl;
	bcGovCopyrightUrl = SPD_CONSTANTS.urls.bcGovCopyrightUrl;
	bcGovContactUrl = SPD_CONSTANTS.urls.bcGovContactUrl;

	env: string | null | undefined = null;

	constructor(
		private commonApplicationService: CommonApplicationService,
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
