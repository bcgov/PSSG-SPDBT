import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GuideDogServiceDogRoutes } from '../guide-dog-service-dog-routes';

@Component({
	selector: 'app-guide-dog-service-dog-main',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-12 my-auto">
							<h2 class="fs-3">Guide Dog Service Dog</h2>
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-4"></mat-divider>

					<div class="text-minor-heading my-3">Registering a Guide or Service Dog</div>
				</div>
			</div>
		</section>
	`,
	styles: ``,
	standalone: false,
})
export class GuideDogServiceDogMainComponent {
	constructor(private router: Router) {}

	onRegister(): void {
		this.router.navigateByUrl(GuideDogServiceDogRoutes.path(GuideDogServiceDogRoutes.GUIDE_DOG_SERVICE_DOG));
	}
}
