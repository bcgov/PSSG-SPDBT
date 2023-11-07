import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/internal/operators/take';
import { tap } from 'rxjs/internal/operators/tap';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-user-applications-unauth',
	template: `
		<section class="step-section px-4 py-2">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<h2 class="my-3 fw-normal">Security Licences & Permits</h2>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<app-alert type="info">
						Did you know that you were signed in, you could save partial applications and continue later?
					</app-alert>

					<button mat-flat-button color="primary" class="large w-auto my-4" (click)="onCreateNew()">
						Apply for a New Licence or Permit
					</button>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class UserApplicationsUnauthComponent {
	constructor(private router: Router, private licenceApplicationService: LicenceApplicationService) {}

	onCreateNew(): void {
		this.licenceApplicationService.reset();

		this.licenceApplicationService
			.createNewLicence()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathSecurityWorkerLicence(LicenceApplicationRoutes.LICENCE_SELECTION)
					);
				}),
				take(1)
			)
			.subscribe();
	}
}
