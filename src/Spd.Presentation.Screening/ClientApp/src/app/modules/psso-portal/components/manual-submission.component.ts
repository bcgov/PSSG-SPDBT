import { Component } from '@angular/core';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';

@Component({
	selector: 'app-manual-submission',
	template: ` <app-manual-submission-common [portal]="portal.Psso"></app-manual-submission-common> `,
	styles: [],
})
export class ManualSubmissionComponent {
	portal = PortalTypeCode;
}
