import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { CommonApplicationService } from '../../services/common-application.service';

@Component({
	selector: 'app-worker-licence-application-base-anonymous',
	template: ` <router-outlet></router-outlet> `,
	styles: [],
})
export class WorkerLicenceApplicationBaseAnonymousComponent implements OnInit {
	constructor(
		private router: Router,
		private licenceApplicationService: LicenceApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous());
			return;
		}

		this.commonApplicationService.setApplicationTitle(WorkerLicenceTypeCode.SecurityWorkerLicence);
	}
}
