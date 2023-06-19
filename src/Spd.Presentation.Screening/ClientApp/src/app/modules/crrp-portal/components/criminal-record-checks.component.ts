import { Component } from '@angular/core';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';

@Component({
	selector: 'app-criminal-record-checks',
	template: `
		<app-crrp-header></app-crrp-header>

		<app-screening-requests-common
			[portal]="portal.Crrp"
			heading="Criminal Record Check Requests"
			subtitle="Criminal record check request links will expire 14 days after being sent"
		></app-screening-requests-common>
	`,
	styles: [],
})
export class CriminalRecordChecksComponent {
	portal = PortalTypeCode;
}
