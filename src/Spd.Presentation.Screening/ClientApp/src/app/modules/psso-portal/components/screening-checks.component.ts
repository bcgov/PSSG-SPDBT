import { Component } from '@angular/core';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';

@Component({
	selector: 'app-screening-checks',
	template: `
		<app-screening-requests-common
			[portal]="portal.Psso"
			heading="Screening Requests"
			subtitle="Screening request links will expire 14 days after being sent"
		></app-screening-requests-common>
	`,
	styles: [],
})
export class ScreeningChecksComponent {
	portal = PortalTypeCode;

	onAddScreeningRequest(): void {}
}
