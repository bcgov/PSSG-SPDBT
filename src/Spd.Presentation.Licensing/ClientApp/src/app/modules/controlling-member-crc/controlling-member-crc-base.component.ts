import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { ControllingMembersService } from '@app/core/services/controlling-members.service';
import { ControllingMembersCrcRoutes } from './controlling-member-crc-routing.module';

@Component({
	selector: 'app-controlling-member-crc-base',
	template: `
		<ng-container *ngIf="isAuthenticated$ | async">
			<div class="container px-0 my-0 px-md-2 my-md-3">
				<!-- hide padding/margin on smaller screens -->
				<div class="row">
					<div class="col-12">
						<router-outlet></router-outlet>
					</div>
				</div>
			</div>
		</ng-container>
	`,
	styles: [],
})
export class ControllingMemberCrcBaseComponent implements OnInit {
	isAuthenticated$ = this.authProcessService.waitUntilAuthentication$;

	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private controllingMembersService: ControllingMembersService
	) {}

	async ngOnInit(): Promise<void> {
		this.authProcessService.logoutBceid();

		await this.authProcessService.initializeLicencingBCSC(
			ControllingMembersCrcRoutes.pathControllingMembers(ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_NEW)
		);

		if (!this.controllingMembersService.initialized) {
			this.router.navigateByUrl(
				ControllingMembersCrcRoutes.path(ControllingMembersCrcRoutes.CONTROLLING_MEMBERS_LOGIN)
			);
			return;
		}
	}
}
