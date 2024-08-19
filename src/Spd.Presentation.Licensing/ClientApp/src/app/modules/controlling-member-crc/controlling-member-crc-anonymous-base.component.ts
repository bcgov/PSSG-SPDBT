import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { ControllingMembersService } from '@app/core/services/controlling-members.service';
import { ControllingMembersCrcRoutes } from './controlling-member-crc-routing.module';

@Component({
	selector: 'app-controlling-member-crc-anonymous-base',
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
export class ControllingMemberCrcAnonymousBaseComponent implements OnInit {
	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private controllingMembersService: ControllingMembersService
	) {}

	async ngOnInit(): Promise<void> {
		this.authProcessService.logoutBceid();
		this.authProcessService.logoutBcsc();

		if (!this.controllingMembersService.initialized) {
			this.router.navigateByUrl(
				ControllingMembersCrcRoutes.path(ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_LOGIN)
			);
			return;
		}
	}
}
