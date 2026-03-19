import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrrpRoutes } from './modules/crrp-portal/crrp-routes';
import { OrgRegistrationRoutes } from './modules/org-registration-portal/org-registration-routes';
import { PssoRoutes } from './modules/psso-portal/psso-routes';

@Component({
	selector: 'app-landing',
	template: `
		<div class="landing-sections">
			<section class="step-section p-4">
				<h3>Criminal Records Review Program Organization Online Access</h3>
				<p class="mt-4 lead">Submit and manage criminal record checks for your employees or volunteers under Criminal Records Review Act <br>
				(<a href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/00_96086_01" target="_blank">CRRA</a>).</p>

				<div><b>Option 1: Log in with your Business BCeID</b></div>
				<button mat-flat-button color="primary" class="large my-2" (click)="goToCrrp()">Business BCeID</button>
				<div class="mt-4"><b>Option 2: Don't have a Business BCeID ?</b></div>
				<br>
				<p>Give your applicants your organization's access code to submit their criminal record check online and provide them this link :
				 <a href="https://justice.gov.bc.ca/screening/crrpa/org-access" target="_blank">https://justice.gov.bc.ca/screening/crrpa/org-access</a>
				</p>
				
			</section>
			<section class="step-section p-4">
				<h3>BC Public Service Security Screening Hiring Manager Online Access</h3>
				<p class="mt-4 lead">Submit and manage criminal record checks.</p>
				<div class="login-section">
				<b>Login:</b>
				<button mat-flat-button color="primary" class="large my-2" (click)="goToPsso()">IDIR Account</button>
				</div>
				<div class="CRRA-padding">
                 <b>CRRA checks cannot be submitted using IDIR.</b>
				</div>
			</section>
		</div>
	`,
	styles: [
		`
			.landing-sections {
				display: flex;
				justify-content: center;
				gap: 1.5rem;
				margin-top: 1rem;
				padding: 0 1rem;
				align-items: stretch;
			}

			.landing-sections .step-section {
				flex: 1 1 420px;
				max-width: 560px;
				margin-top: 0 !important;
				text-align: center;
			}

			.login-section {
              padding-top: 60px;
			}
			.CRRA-padding{
				padding-top: 90px;
			}

			a {
				color: var(--bs-link-color) !important;
				text-decoration: underline !important;
			}

			@media (max-width: 991.98px) {
				.landing-sections {
					flex-direction: column;
				}
			}
		`,
	],
	standalone: false
})
export class LandingComponent {
	constructor(private router: Router) { }

	goToPsso(): void {
		this.router.navigateByUrl(PssoRoutes.path(PssoRoutes.SCREENING_STATUSES));
	}

	goToCrrp(): void {
		this.router.navigateByUrl(CrrpRoutes.path(CrrpRoutes.HOME));
	}
}
