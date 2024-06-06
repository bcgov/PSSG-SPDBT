import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IdentityProviderTypeCode } from 'src/app/api/models';

@Component({
	selector: 'app-login-failure',
	template: `
		<div class="container mt-4">
			<section class="step-section p-3">
				<div class="row">
					<div class="col-12">
						<h3 class="fw-normal m-2">Login Failure</h3>
					</div>
				</div>

				<mat-divider class="mb-2 mb-lg-4"></mat-divider>

				<div class="d-flex justify-content-center">
					<div class="payment__image text-center">
						<img class="payment__image__item" src="/assets/login-no-identity.png" alt="Login no identity" />
					</div>
				</div>

				<div class="row">
					<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12 mt-4 text-center">
						<div class="fw-normal fs-3">We’re sorry, we are unable to find your information in our records.</div>
					</div>
				</div>

				<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12" *ngIf="isSecurityScreening">
					<div class="lead fs-5 mt-4">
						If you have not yet submitted a criminal record check application, please contact your organization to
						initiate the process.
					</div>
					<div class="lead fs-5 my-4">
						If you submitted a criminal record check application using your BC Services Card, please reach out to our
						client services team at <a href="mailto:criminalrecords@gov.bc.ca">criminalrecords&#64;gov.bc.ca</a> or
						1-855-587-0185 (option 2) for further assistance.
					</div>
				</div>

				<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12" *ngIf="isPsso">
					<div class="lead fs-5 mt-4">
						Your IDIR Ministry code - {{ orgCodeFromIdir }} doesn't exist in the PSSO system, please contact
						<a href="mailto:criminalrecords@gov.bc.ca">criminalrecords&#64;gov.bc.ca</a> with a screenshot of this
						message for assistance.
					</div>
				</div>
			</section>
		</div>
	`,
	styles: [],
})
export class LoginFailureComponent implements OnInit {
	isPsso = false;
	isSecurityScreening = false;

	identityProviderTypeCode: IdentityProviderTypeCode | null = null;
	orgCodeFromIdir: string | null = null;

	constructor(private location: Location) {}

	ngOnInit(): void {
		this.identityProviderTypeCode = (this.location.getState() as any)?.identityProviderTypeCode ?? null;
		this.orgCodeFromIdir = (this.location.getState() as any)?.orgCodeFromIdir ?? null; // set when IDIR failure

		this.isPsso = this.identityProviderTypeCode === IdentityProviderTypeCode.Idir;
		this.isSecurityScreening = this.identityProviderTypeCode === IdentityProviderTypeCode.BcServicesCard;
	}
}
