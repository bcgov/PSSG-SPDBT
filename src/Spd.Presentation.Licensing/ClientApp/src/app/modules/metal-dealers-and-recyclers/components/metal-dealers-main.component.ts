import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
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

					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-12 my-auto">
							<div class="text-minor-heading mb-4">Registering as a Metal Dealer or Recycler</div>
						</div>

						<div class="col-xl-6 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end mb-4">
								<button mat-flat-button color="primary" class="large w-auto" (click)="onRegister()">
									Register as a Metal Dealer or Recycler
								</button>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-12">
							<p>
								British Columbia introduced the <i>Metal Dealers and Recyclers Act</i> (the Act) to help prevent metal
								theft, which poses a public safety risk, while protecting the personal information of metal sellers. The
								Act holds dealers and sellers accountable and sets consistent provincial standards.
							</p>
							<p>
								There are no fees for registering, renewing, or updating registration information. Registration is
								legally required for metal dealers and recyclers in most cases.
							</p>

							<div class="text-minor-heading my-3">Terms and Conditions of Registration</div>
							<ul>
								<li class="metal-dealers-checklist-label">No registration fee</li>
								<li class="metal-dealers-checklist-label">3-year registration term</li>
								<li class="metal-dealers-checklist-label">
									Must provide business name, address, telephone number, and email address (if any)
								</li>
								<li class="metal-dealers-checklist-label">Must provide the address of all business locations</li>
								<li class="metal-dealers-checklist-label">
									Must provide the identity of the person(s) responsible for the daily management of the business
								</li>
								<li class="metal-dealers-checklist-label">
									Must provide copies of the business licence registration documents
								</li>
								<li class="metal-dealers-checklist-label">
									Must display the registration certificate in a visible place at each business location
								</li>
								<li class="metal-dealers-checklist-label">
									Registration cannot be transferred without the Registrar’s written consent
								</li>
								<li class="metal-dealers-checklist-label">
									The registrant must immediately return the registration and all duplicates to the Registrar upon the
									expiry, cancellation, suspension, or refusal of a registration renewal
								</li>
								<li class="metal-dealers-checklist-label">
									The registrant must not carry on a business using a name other than the name specified in the
									registration
								</li>
							</ul>

							<app-alert type="success" icon="">
								<p>
									Further information regarding the <i>Metal Dealers and Recyclers Act</i> can be found on
									<a
										aria-label="Navigate to Metal Dealers and Recyclers Act site"
										href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/metal-recycling/the-act-and-regulations"
										>our website</a
									>.
								</p>
								<p>
									If you have any questions, please call the Security Program's Licensing Unit during regular office
									hours: {{ spdPhoneNumber }}
								</p>
							</app-alert>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.metal-dealers-checklist-label {
				color: var(--color-primary);
				line-height: 1.75em;
			}
		`,
	],
	standalone: false,
})
export class MetalDealersMainComponent implements OnInit {
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	constructor(
		private router: Router,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.commonApplicationService.setMdraApplicationTitle();
	}

	onRegister(): void {
		this.router.navigateByUrl(
			MetalDealersAndRecyclersRoutes.path(MetalDealersAndRecyclersRoutes.MDRA_APPLICATION_TYPE)
		);
	}
}
