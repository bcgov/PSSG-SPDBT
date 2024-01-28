import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { CommonApplicationService } from '../../services/common-application.service';
import { PermitApplicationService } from '../../services/permit-application.service';

@Component({
	selector: 'app-permit-application-base-anonymous',
	template: ` <router-outlet></router-outlet> `,
	styles: [],
})
export class PermitApplicationBaseAnonymousComponent implements OnInit {
	constructor(
		private router: Router,
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		if (!this.permitApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathPermitAnonymous());
			return;
		}

		const workerLicenceTypeCode = this.permitApplicationService.permitModelFormGroup.get(
			'workerLicenceTypeData.workerLicenceTypeCode'
		)?.value;

		this.commonApplicationService.setApplicationTitle(workerLicenceTypeCode);
	}
}
