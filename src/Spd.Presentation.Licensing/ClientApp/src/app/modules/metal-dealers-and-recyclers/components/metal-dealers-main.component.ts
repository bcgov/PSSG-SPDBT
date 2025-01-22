import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { MetalDealersAndRecyclersRoutes } from '@app/modules/metal-dealers-and-recyclers/metal-dealers-and-recyclers-routes';
import { take, tap } from 'rxjs';

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
							<div class="text-minor-heading mb-4">Registering as a Metal Recycling Dealer</div>
						</div>

						<div class="col-xl-6 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end mb-4">
								<button mat-flat-button color="primary" class="large w-auto" (click)="onRegister()">
									Register as a Metal Recycling Dealer
								</button>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-12">
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
							<p>There is no fee for registration, renewal or updating registration information.</p>

							<div class="text-minor-heading my-3">Terms and Conditions of Registration</div>
							<ul>
								<li class="metal-dealers-checklist-label">No registration fee</li>
								<li class="metal-dealers-checklist-label">Term of registration is 3 years</li>
								<li class="metal-dealers-checklist-label">
									Must provide business name, address, telephone number, and email address (if any)
								</li>
								<li class="metal-dealers-checklist-label">Must provide address of additional business locations</li>
								<li class="metal-dealers-checklist-label">
									Must provide the identity of person(s) responsible for the daily management of the business
								</li>
								<li class="metal-dealers-checklist-label">
									Must provide copies of business licence registration documents
								</li>
								<li class="metal-dealers-checklist-label">
									Must display registration certificate in a conspicuous place at each of the business locations
								</li>
								<li class="metal-dealers-checklist-label">
									Registration must not be transferred unless the Registrar consents in writing to the transfer
								</li>
								<li class="metal-dealers-checklist-label">
									On the expiry, cancellation, suspension or refusal of a renewal of a registration, the registrant must
									immediately surrender the registration and all duplicates to the registrar
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
export class MetalDealersMainComponent {
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	constructor(
		private router: Router,
		private metalDealersApplicationService: MetalDealersApplicationService
	) {}

	onRegister(): void {
		this.metalDealersApplicationService
			.createNewRegistration()
			.pipe(
				tap((_resp: any) => {
					this.router.navigateByUrl(
						MetalDealersAndRecyclersRoutes.path(MetalDealersAndRecyclersRoutes.METAL_DEALERS_AND_RECYCLERS_REGISTER)
					);
				}),
				take(1)
			)
			.subscribe();
	}
}
