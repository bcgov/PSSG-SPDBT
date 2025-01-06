import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

@Component({
	selector: 'app-step-business-licence-checklist-new',
	template: `
		<app-step-section title="Checklist" subtitle="Make sure you have the following items before you continue">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="fw-semibold fs-6">For all applicants:</div>

					<ul>
						<li>
							<div class="checklist-label">Images of business branding</div>
							<p class="checklist-info">
								Provide examples of your business's logo or branding on uniforms, advertising, vehicles, business cards,
								etc. We recommend you do not finalize any branding, marketing or advertising until your licence is
								approved.
							</p>
						</li>
						<li>
							<div class="checklist-label">Proof of insurance</div>
							<p class="checklist-info">
								You will need to provide proof of this security business’s valid general liability insurance of not less
								than $1 million coverage.
							</p>
						</li>
						<li>
							<div class="checklist-label">Security worker licence information</div>
							<p class="checklist-info">
								You will need to provide a valid security worker licence that supports the licence category the business
								wishes to be licensed for. This includes sole proprietors, employees, and controlling members.
							</p>
						</li>
						<li>
							<div class="checklist-label">Business type</div>
							<p class="checklist-info">
								You will need to know if your business is registered with
								<a aria-label="B.C. Corporate Registries" [href]="bcCorporateRegistriesUrl" target="_blank"
									>B.C. Corporate Registries</a
								>, and if the business is a Sole Proprietor, Partnership, or Corporation.
							</p>
						</li>
						<li>
							<div class="checklist-label">Credit card</div>
							<p class="checklist-info">All major credit cards are accepted through our secure payment platform.</p>
						</li>
					</ul>

					<mat-divider class="my-4"></mat-divider>
					<div class="fw-semibold fs-6">For some applicants:</div>

					<ul>
						<li>
							<div class="checklist-label">Expired licence (if applicable)</div>
							<p class="checklist-info">
								If you have a Security Worker Licence that has expired, we can use the number and expiry date to connect
								this application to your file.
							</p>
						</li>
						<li>
							<div class="checklist-label">Controlling member security worker licence information</div>
							<p class="checklist-info">
								You will need to provide a valid Security Worker Licence for each
								<a
									aria-label="controlling member of your business"
									[href]="controllingMemberChecklistUrl"
									target="_blank"
									>controlling member of your business</a
								>. If they don't have a valid licence, provide their email address so they can consent to a criminal
								record check.
							</p>
						</li>
						<li>
							<div class="checklist-label">
								If you are applying for an Armoured Car Guard licence, provide documentation
							</div>
							<p class="checklist-info">
								You will need to provide proof you own, lease or rent an approved armoured car; proof of liability
								insurance; and a
								<a aria-label="safety certificate" [href]="safetyCertificateChecklistUrl" target="_blank"
									>safety certificate</a
								>.
							</p>
						</li>
						<li>
							<div class="checklist-label">
								If you are applying for an Authorization for use of dogs, provide proof of qualification
							</div>
							<p class="checklist-info">You will need to provide a Security Dog Validation Certificate for each dog.</p>
						</li>
					</ul>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepBusinessLicenceChecklistNewComponent {
	bcCorporateRegistriesUrl = SPD_CONSTANTS.urls.bcCorporateRegistriesUrl;
	controllingMemberChecklistUrl = SPD_CONSTANTS.urls.controllingMemberChecklistUrl;
	safetyCertificateChecklistUrl = SPD_CONSTANTS.urls.safetyCertificateChecklistUrl;
}
