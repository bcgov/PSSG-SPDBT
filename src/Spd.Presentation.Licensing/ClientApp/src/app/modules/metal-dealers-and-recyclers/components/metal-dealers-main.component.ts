import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MetalDealersAndRecyclersRoutes } from '@app/modules/metal-dealers-and-recyclers/metal-dealers-and-recyclers-routes';

@Component({
	selector: 'app-metal-dealers-main',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-12 my-auto">
							<h2 class="fs-3">Metal Dealers & Recyclers</h2>
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-4"></mat-divider>

					<div class="text-minor-heading my-3">Registering as a metal recycling dealer</div>

					<div class="row">
						<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12">
							<p>
								Metal theft puts public safety at risk because it interferes with telephone services, emergency
								communications and transportation systems, and may expose the public to electrocution from live wires.
							</p>

							<p>
								The Province passed the <i>Metal Dealers and Recyclers Act</i> and
								<i>Metal Dealers Recyclers Regulation</i>. The act and regulation help deter and track metal theft, and
								protect the personal information of scrap metal sellers. They also increase the accountability of
								dealers and sellers and create consistent, minimum requirements across the province.
							</p>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<button mat-flat-button color="primary" class="large" (click)="onRegister()">
								Register as a Metal Recycling Dealer
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: ``,
	standalone: false,
})
export class MetalDealersMainComponent {
	constructor(private router: Router) {}

	onRegister(): void {
		this.router.navigateByUrl(
			MetalDealersAndRecyclersRoutes.path(MetalDealersAndRecyclersRoutes.METAL_DEALERS_AND_RECYCLERS_REGISTER)
		);
	}
}
