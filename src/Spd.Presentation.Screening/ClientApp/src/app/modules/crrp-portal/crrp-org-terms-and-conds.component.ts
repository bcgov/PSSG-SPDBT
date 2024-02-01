import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { CrrpRoutes } from './crrp-routing.module';

@Component({
	selector: 'app-crrp-org-terms-and-conds',
	template: ``,
	styles: [],
})
export class CrrpOrgTermsAndCondsComponent implements OnInit {
	invitationId: string | null = null;

	constructor(private route: ActivatedRoute, private authProcessService: AuthProcessService, private router: Router) {}

	async ngOnInit(): Promise<void> {
		this.invitationId = this.route.snapshot.paramMap.get('id');
		if (!this.invitationId) {
			console.debug('CrrpOrgTermsAndCondsComponent - missing invitation id');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		await this.authProcessService.initializeCrrpUserInvitation(location.pathname);

		this.authProcessService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			if (isLoggedIn) {
				const url = `${CrrpRoutes.path(CrrpRoutes.INVITATION_ACCEPT)}/${this.invitationId}`;
				this.router.navigate([url]);
			}
		});
	}
}
