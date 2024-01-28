import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { BusinessApplicationService } from '../../services/business-application.service';
import { CommonApplicationService } from '../../services/common-application.service';

@Component({
	selector: 'app-business-application-base-anonymous',
	template: ` <router-outlet></router-outlet> `,
	styles: [],
})
export class BusinessApplicationBaseAnonymousComponent implements OnInit {
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
