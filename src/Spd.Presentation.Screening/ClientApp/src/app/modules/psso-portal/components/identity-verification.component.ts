import { Component } from '@angular/core';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';

@Component({
	selector: 'app-identity-verification',
	template: ` <app-identify-verification-common [portal]="portal.Psso"></app-identify-verification-common> `,
	styles: [],
})
export class IdentityVerificationComponent {
	portal = PortalTypeCode;
}
