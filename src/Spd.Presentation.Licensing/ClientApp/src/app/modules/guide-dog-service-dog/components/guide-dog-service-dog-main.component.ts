import { Component } from '@angular/core';

@Component({
	selector: 'app-guide-dog-service-dog-main',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-12">
							<h2 class="fs-3">Guide Dog & Service Dog Certifications</h2>
						</div>
					</div>

					<mat-divider class="mat-divider-main mb-3"></mat-divider>
					<app-gdsd-active-certifications></app-gdsd-active-certifications>
				</div>
			</div>
		</section>
	`,
	styles: [],
	standalone: false,
})
export class GuideDogServiceDogMainComponent {}
