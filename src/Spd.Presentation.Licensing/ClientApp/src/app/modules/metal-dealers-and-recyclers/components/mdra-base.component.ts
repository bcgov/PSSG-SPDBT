import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { MetalDealersAndRecyclersRoutes } from '../metal-dealers-and-recyclers-routes';

@Component({
	selector: 'app-mdra-base',
	template: `
		<div class="container px-0 my-0 px-md-2 my-md-3">
			<!-- hide padding/margin on smaller screens -->
			<div class="row">
				<div class="col-12">
					<router-outlet></router-outlet>
				</div>
			</div>
		</div>
	`,
	styles: ``,
	standalone: false,
})
export class MdraBaseComponent implements OnInit {
	constructor(
		private router: Router,
		private commonApplicationService: CommonApplicationService,
		private metalDealersApplicationService: MetalDealersApplicationService
	) {}

	ngOnInit(): void {
		if (!this.metalDealersApplicationService.initialized) {
			this.router.navigateByUrl(MetalDealersAndRecyclersRoutes.path());
			return;
		}

		this.commonApplicationService.setMdraApplicationTitle();
	}
}
