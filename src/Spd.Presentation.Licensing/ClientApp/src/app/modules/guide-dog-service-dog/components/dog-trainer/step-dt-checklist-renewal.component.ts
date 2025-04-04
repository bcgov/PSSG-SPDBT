import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

@Component({
	selector: 'app-step-dt-checklist-renewal',
	template: `
		<app-step-section title="Checklist" subtitle="Make sure you have the following items before you continue">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="fw-semibold fs-6 mb-2">For all applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Government-issued photo ID</div>
							<p class="checklist-info">
								The identification needs to be issued by a federal, provincial, territorial or state government
								authority.
							</p>
						</li>
					</ul>

					<mat-divider class="my-4"></mat-divider>
					<div class="fw-semibold fs-6 mb-2">For some applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Photograph of yourself for the licence</div>
							<p class="checklist-info">
								You will need to upload a passport-quality photo of your face looking at the camera, with a plain, white
								background. Uploading a photo that doesn't meet these requirements will delay the processing of your
								application. For more details on passport-quality photos, please refer to the
								<a
									aria-label="Navigate to Government of Canada's passport photograph guidelines site"
									[href]="canadianPassportPhotoUrl"
									target="_blank"
									>Government of Canada's passport photograph guidelines</a
								>.
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
export class StepDtChecklistRenewalComponent {
	canadianPassportPhotoUrl = SPD_CONSTANTS.urls.canadianPassportPhotoUrl;
}
