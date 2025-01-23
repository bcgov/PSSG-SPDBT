import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

@Component({
	selector: 'app-step-gdsd-checklist-new',
	template: `
		<app-step-section title="Checklist" subtitle="Make sure you have the following items before you continue">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="fw-semibold fs-6 mb-2">For all applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Proof of fingerprinting request</div>
							<p class="checklist-info">
								All applicants must submit a proof of fingerprinting request. Download the
								<a
									aria-label="Download Request for Fingerprinting form"
									download="Request For Fingerprinting Form"
									[href]="downloadFilePath"
									>Request for Fingerprinting form</a
								>, take it your local police department, and return to this application when you have this form
								completed.
							</p>
						</li>

						<li>
							<div class="checklist-label">Proof of training and experience</div>
							<!-- // TODO update URL -->
							<p class="checklist-info">
								Some categories of security workers, such as security guards, require proof of training and/or
								experience.
								<a aria-label="Navigate to " [href]="bcGovHomeUrl" target="_blank">Learn more</a>
								about the types of documents we accept for each security worker category.
							</p>
						</li>

						<li>
							<div class="checklist-label">Proof of Canadian citizenship or ability to work in Canada</div>
							<!-- // TODO update URL -->
							<p class="checklist-info">
								See all accepted forms of identification on the
								<a aria-label="Navigate to " [href]="bcGovHomeUrl" target="_blank"
									>Security Worker Licence requirements page</a
								>.
							</p>
						</li>

						<li>
							<div class="checklist-label">Government-issued photo ID</div>
							<p class="checklist-info">
								The identification needs to be issued by a federal, provincial, territorial or state government
								authority.
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

						<li>
							<div class="checklist-label">Credit card</div>
							<p class="checklist-info">All major credit cards are accepted through our secure payment platform.</p>
						</li>
					</ul>

					<!-- <mat-divider class="my-4"></mat-divider>
					<div class="fw-semibold fs-6 mb-2">For some applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Expired licence (if applicable)</div>
							<p class="checklist-info">
								If you have a Security Worker Licence that has expired, we can use the number and expiry date to connect
								this application to your file.
							</p>
						</li>

						<li>
							<div class="checklist-label">If you are a Peace Officer, provide a letter of no conflict</div>
							<p class="checklist-info">Your superior officer must write a letter of no conflict for you to upload.</p>
						</li>

						<li>
							<div class="checklist-label">If you have a mental health condition, provide a physician's assessment</div>
							<p class="checklist-info">
								Download the
								<a
									aria-label="Navigate to Mental Health Condition form site"
									[href]="mentalHealthConditionsFormUrl"
									target="_blank"
								>
									Mental Health Condition form</a
								>, and give it to your physician to fill out. You will need to upload the completed form.
							</p>
						</li>
					</ul> -->
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepGdsdChecklistNewComponent {
	bcGovHomeUrl = SPD_CONSTANTS.urls.bcGovHomeUrl;
	canadianPassportPhotoUrl = SPD_CONSTANTS.urls.canadianPassportPhotoUrl;
	mentalHealthConditionsFormUrl = SPD_CONSTANTS.urls.mentalHealthConditionsFormUrl;
	downloadFilePath = SPD_CONSTANTS.files.requestForFingerprintingForm;
	// TODO GDSD update checklist
}
