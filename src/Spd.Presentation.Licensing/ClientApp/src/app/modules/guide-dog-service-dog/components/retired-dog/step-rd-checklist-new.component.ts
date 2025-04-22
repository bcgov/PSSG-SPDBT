import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

@Component({
	selector: 'app-step-rd-checklist-new',
	template: `
		<app-step-section title="Checklist" subtitle="Make sure you have the following items before you continue">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="fw-semibold fs-6 mb-2">For all applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Guide or Service Dog Certificate</div>
							<p class="checklist-info">
								Proof of formal GDSDA certification, or an identification card issued by a school that is accredited by
								ADI or IGDF
							</p>
						</li>

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

					<mat-divider class="my-4"></mat-divider>
					<div class="fw-semibold fs-6 mb-2">For some applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Microchip Number</div>
							<p class="checklist-info">Optionally, the Microchip Number can be supplied.</p>
						</li>
					</ul>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepRdChecklistNewComponent {
	canadianPassportPhotoUrl = SPD_CONSTANTS.urls.canadianPassportPhotoUrl;
}
