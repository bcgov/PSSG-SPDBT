import { Component } from '@angular/core';

@Component({
	selector: 'app-screening-checks',
	template: `
		<app-screening-requests-common
			portal="PSSO"
			title="Screening Requests"
			subtitle="Screening request links will expire 14 days after being sent"
		></app-screening-requests-common>
	`,
	styles: [],
})
export class ScreeningChecksComponent {
	onAddScreeningRequest(): void {}
}
