import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { take } from 'rxjs/internal/operators/take';
import { tap } from 'rxjs/internal/operators/tap';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';

@Component({
	selector: 'app-user-applications-anonymous',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<h2 class="my-3 fw-normal">Security Licences & Permits</h2>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<app-alert type="info" icon="info">
						Did you know that if you were signed in, you could save partial applications and complete them later?
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
export class UserApplicationsAnonymousComponent implements OnInit {
	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	async ngOnInit(): Promise<void> {
		this.authProcessService.logoutBceid();
		this.authProcessService.logoutBcsc();
	}

	onCreateNew(): void {
		this.licenceApplicationService
			.createNewLicenceAnonymous()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						LicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
							LicenceApplicationRoutes.LICENCE_SELECTION_ANONYMOUS
						)
					);
				}),
				take(1)
			)
			.subscribe();
	}
}
