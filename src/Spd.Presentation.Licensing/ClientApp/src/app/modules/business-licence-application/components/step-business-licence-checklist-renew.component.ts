import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

@Component({
	selector: 'app-step-business-licence-checklist-renew',
	template: `
		<app-step-section heading="Checklist" subheading="Make sure you have the following items before you continue">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="fw-semibold fs-6 mb-2">For all applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Proof of insurance</div>
							<p class="checklist-info">
								You need to provide proof of an active general liability insurance policy with no less than $1 million
								coverage.
							</p>
						</li>

						<li>
							<div class="checklist-label">Credit card</div>
							<p class="checklist-info">
								All major credit cards are accepted through our secure online payment system.
							</p>
						</li>
					</ul>

					<mat-divider class="my-4"></mat-divider>
					<div class="fw-semibold fs-6 mb-2">For some applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">If your business's branding has changed, provide new images</div>
							<p class="checklist-info">
								Provide examples of your business's logo or branding on uniforms, advertising, vehicles, business cards,
								etc.
							</p>
						</li>

						<li>
							<div class="checklist-label">If your business name has changed, proof of legal name change</div>
							<p class="checklist-info">You must upload documentation of legal business name change.</p>
						</li>

						<li>
							<div class="checklist-label">New employee security worker licence information</div>
							<p class="checklist-info">
								If you have new employees, provide their names and valid Security Worker Licence numbers.
							</p>
						</li>

						<li>
							<div class="checklist-label">New controlling member security worker licence information</div>
							<p class="checklist-info">
								You need to provide a valid Security Worker Licence for each
								<a
									aria-label="Navigate to controlling member of your business site"
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
								You need to provide proof you own, lease, or rent an approved armoured car, proof of liability
								insurance, and a
								<a
									aria-label="Navigate to safety certificate site"
									[href]="safetyCertificateChecklistUrl"
									target="_blank"
									>safety certificate</a
								>.
							</p>
						</li>

						<li>
							<div class="checklist-label">
								If you are applying for an Authorization for use of dogs, provide proof of qualification
							</div>
							<p class="checklist-info">You need to provide a Security Dog Validation Certificate for each dog.</p>
						</li>
					</ul>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepBusinessLicenceChecklistRenewComponent {
	controllingMemberChecklistUrl = SPD_CONSTANTS.urls.controllingMemberChecklistUrl;
	safetyCertificateChecklistUrl = SPD_CONSTANTS.urls.safetyCertificateChecklistUrl;
}
