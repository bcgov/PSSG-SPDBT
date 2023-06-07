import { Component } from '@angular/core';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';

@Component({
	selector: 'app-manual-submission',
	template: `
		<app-crrp-header></app-crrp-header>

		<app-manual-submission-common [portal]="portal.Crrp"></app-manual-submission-common>
	`,
	styles: [],
})
export class ManualSubmissionComponent {
	portal = PortalTypeCode;
}
