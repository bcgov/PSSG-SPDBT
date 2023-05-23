import { Component } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
	selector: 'app-banner',
	template: `
		<div class="alert alert-warning d-flex align-items-center" role="alert">
			<mat-icon class="d-none d-lg-block alert-icon me-2">schedule</mat-icon>
			<div>
				<div>We are currently processing applications that do NOT require follow-up within:</div>
				<div class="fw-semibold">
					{{ bannerMessage }}
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class BannerComponent {
	bannerMessage = '';

	constructor(private configService: ConfigService) {
		this.bannerMessage = this.configService.configs?.bannerMessage!;
	}
}
