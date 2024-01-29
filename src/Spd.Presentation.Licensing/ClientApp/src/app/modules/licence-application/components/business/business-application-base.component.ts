import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';

@Component({
	selector: 'app-business-application-base',
	template: ` <router-outlet></router-outlet> `,
	styles: [],
})
export class BusinessApplicationBaseComponent implements OnInit {
	constructor(
		private router: Router,
		private businessApplicationService: BusinessApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		if (!this.businessApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessAnonymous());
			return;
		}

		this.commonApplicationService.updateTitle('Business Licence');
	}
}
