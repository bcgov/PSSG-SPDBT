import { Component } from '@angular/core';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';

@Component({
	selector: 'app-identify-verification',
	template: `
		<app-crrp-header></app-crrp-header>

		<app-identify-verification-common [portal]="portal.Crrp"></app-identify-verification-common>
	`,
	styles: [],
})
export class IdentifyVerificationComponent {
	portal = PortalTypeCode;
}
