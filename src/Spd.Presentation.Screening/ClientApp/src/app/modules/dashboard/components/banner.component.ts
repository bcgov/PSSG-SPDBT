import { Component } from '@angular/core';

@Component({
	selector: 'app-banner',
	template: `
		<div class="alert alert-warning d-flex align-items-center" role="alert">
			<mat-icon class="d-none d-lg-block alert-icon me-2">schedule</mat-icon>
			<div>
				<div>We are currently processing applications that do NOT require follow-up within:</div>
				<div class="fw-semibold">
					10 business days for online applications and 20 business days for manual applications
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class BannerComponent {}
