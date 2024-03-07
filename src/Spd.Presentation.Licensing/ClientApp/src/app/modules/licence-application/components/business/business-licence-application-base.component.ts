import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { AuthUserBcscService } from '@app/core/services/auth-user-bcsc.service';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';

@Component({
	selector: 'app-business-licence-application-base',
	template: ` <router-outlet></router-outlet> `,
	styles: [],
})
export class BusinessLicenceApplicationBaseComponent implements OnInit {
	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private authUserBcscService: AuthUserBcscService,
		private businessApplicationService: BusinessApplicationService
	) {}

	async ngOnInit(): Promise<void> {
		// this.authProcessService.logoutBcsc();
		// await this.authProcessService.initializeLicencingBCeID();

		// this.authProcessService.logoutBceid(); // TODO update to use bceid
		// await this.authProcessService.initializeLicencingBCSC();

		// if (this.authUserBcscService.applicantLoginProfile?.isFirstTimeLogin) {
		// 	this.router.navigateByUrl(
		// 		LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.LICENCE_FIRST_TIME_USER_TERMS)
		// 	);
		// }

		if (!this.businessApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessLicence());
			return;
		}
	}
}
