import { Component, OnInit } from '@angular/core';
import { ConfigurationResponse } from '@app/api/models';
import { ConfigService } from '@app/core/services/config.service';

@Component({
	selector: 'app-spd-footer',
	template: `
		<mat-toolbar color="primary" class="no-print footer">
			<span style="flex: 1 1 auto;"></span>

			<span class="fs-7 p-2 text-env" *ngIf="env">{{ env }}</span>
		</mat-toolbar>
	`,
	styles: [
		`
			.footer {
				border-top: 2px solid var(--color-yellow);
			}

			.text-env {
				color: #6c757d !important;
			}
		`,
	],
	standalone: false,
})
export class SpdFooterComponent implements OnInit {
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
