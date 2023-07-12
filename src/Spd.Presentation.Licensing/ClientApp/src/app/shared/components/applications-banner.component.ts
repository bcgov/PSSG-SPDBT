import { Component } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
	selector: 'app-applications-banner',
	template: `
		<app-alert type="warning" icon="schedule">
			<div>
				<div>We are currently processing applications that do NOT require follow-up within:</div>
				<div class="fw-semibold">
					{{ bannerMessage }}
				</div>
			</div>
		</app-alert>
	`,
	styles: [],
})
export class ApplicationsBannerComponent {
	bannerMessage = '';

	constructor(private configService: ConfigService) {
		this.bannerMessage = this.configService.configs?.bannerMessage!;
	}
}
