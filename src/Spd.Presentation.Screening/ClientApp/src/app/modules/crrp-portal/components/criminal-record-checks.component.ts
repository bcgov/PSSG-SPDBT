import { Component } from '@angular/core';

@Component({
	selector: 'app-criminal-record-checks',
	template: `
		<app-crrp-header></app-crrp-header>

		<app-screening-requests-common
			portal="CRRP"
			title="Criminal Record Check Requests"
			subtitle="Criminal record check request links will expire 14 days after being sent"
		></app-screening-requests-common>
	`,
	styles: [],
})
export class CriminalRecordChecksComponent {}
