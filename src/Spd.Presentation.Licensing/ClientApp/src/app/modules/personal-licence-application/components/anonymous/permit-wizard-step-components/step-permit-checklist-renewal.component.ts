import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

@Component({
	selector: 'app-step-permit-checklist-renewal',
	template: `
		<app-step-section title="Checklist" subtitle="Make sure you have the following items before you continue">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="fw-semibold fs-6">For all applicants:</div>

					<ul>
						<li>
							<div class="checklist-label">Photograph of yourself for the permit</div>
							<p class="checklist-info">
								You will need to upload a passport-quality photo of your face looking straight at the camera against a
								plain, white background. Uploading a photo that does not meet the criteria will delay your application's
								processing time. For further information on Passport Quality Photographs, please review the Government
								of Canada’s
								<a
									aria-label="Passport Quality Photographs information"
									[href]="canadianPassportPhotoUrl"
									target="_blank"
									>passport photograph requirements</a
								>.
							</p>
						</li>
						<li>
							<div class="checklist-label">Proof of citizenship or residence status</div>
							<p class="checklist-info">
								You will need to prove your citizenship or residence status by providing a valid piece of
								government-issued identification, either from Canada or another country.
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
							<span class="checklist-label">If you have changed your name, proof of legal name change</span>
							<p class="checklist-info">
								You must upload one of the following documents: marriage certificate, certificate of name change, or a
								copy of your driver's licence/BCID with new name.
							</p>
						</li>
					</ul>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepPermitChecklistRenewalComponent {
	canadianPassportPhotoUrl = SPD_CONSTANTS.urls.canadianPassportPhotoUrl;
}
