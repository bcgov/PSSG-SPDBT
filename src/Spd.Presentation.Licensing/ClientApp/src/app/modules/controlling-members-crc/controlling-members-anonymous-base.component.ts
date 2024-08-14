import { Component, OnInit } from '@angular/core';
import { AuthProcessService } from '@app/core/services/auth-process.service';

@Component({
	selector: 'app-controlling-members-anonymous-base',
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
	styles: [],
})
export class ControllingMembersAnonymousBaseComponent implements OnInit {
	constructor(private authProcessService: AuthProcessService) {}

	async ngOnInit(): Promise<void> {
		this.authProcessService.logoutBceid();
		this.authProcessService.logoutBcsc();

		// if (!this.licenceApplicationService.initialized) {
		// 	this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
		// 	return;
		// }
	}
}
