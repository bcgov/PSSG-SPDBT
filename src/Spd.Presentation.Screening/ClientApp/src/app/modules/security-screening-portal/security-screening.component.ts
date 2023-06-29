import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityProviderTypeCode } from 'src/app/api/models';
import { AuthUserService } from 'src/app/core/services/auth-user.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SecurityScreeningRoutes } from './security-screening-routing.module';

@Component({
	selector: 'app-security-screening',
	template: `
		<div class="container mt-4" *ngIf="isAuthenticated$ | async">
			<section class="step-section p-0 p-lg-4 m-0 m-lg-4">
				<router-outlet></router-outlet>
			</section>
		</div>
	`,
	styles: [],
})
export class SecurityScreeningComponent {
	isAuthenticated$ = this.authenticationService.waitUntilAuthentication$;

	constructor(
		private authUserService: AuthUserService,
		private authenticationService: AuthenticationService,
		private router: Router
	) {}

	async ngOnInit(): Promise<void> {
		const nextUrl = await this.authenticationService.login(
			IdentityProviderTypeCode.BcServicesCard,
			SecurityScreeningRoutes.path()
		); // TODO change to IDIR

		if (nextUrl) {
			const success = await this.authUserService.whoAmIAsync(IdentityProviderTypeCode.BcServicesCard);
			this.authenticationService.notify(success);

			const nextRoute = decodeURIComponent(nextUrl);
			await this.router.navigate([nextRoute]);
		}
	}
}
