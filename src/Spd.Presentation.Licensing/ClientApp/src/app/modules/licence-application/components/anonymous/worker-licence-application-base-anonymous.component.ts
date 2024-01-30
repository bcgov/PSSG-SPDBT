import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-worker-licence-application-base-anonymous',
	template: ` <router-outlet></router-outlet> `,
	styles: [],
})
export class WorkerLicenceApplicationBaseAnonymousComponent implements OnInit {
	constructor(private router: Router, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous());
			return;
		}
	}
}
