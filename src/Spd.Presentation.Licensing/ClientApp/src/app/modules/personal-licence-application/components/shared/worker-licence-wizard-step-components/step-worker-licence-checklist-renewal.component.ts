import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

@Component({
	selector: 'app-step-worker-licence-checklist-renewal',
	template: `
		<app-step-section heading="Checklist" subheading="Make sure you have the following items before you continue">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="fw-semibold fs-6 mb-2">For all applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Proof of training and experience</div>
							<p class="checklist-info">
								If you are adding a new category to your licence, you may need to provide proof of training and/or
								experience. <a aria-label="Navigate to " [href]="swlLearnMoreUrl" target="_blank">Learn more</a> about
								the types of documents we accept for each security worker category.
							</p>
						</li>

						<li>
							<div class="checklist-label">Authorization to Carry (ATC)</div>
							<p class="checklist-info">
								If you are renewing your Armoured Car Guard licence, you must provide a new ATC document.
							</p>
						</li>

						<li>
							<div class="checklist-label">Authorization for use of restraints</div>
							<p class="checklist-info">
								To maintain authorization for using restraints (such as handcuffs), you must provide your Advanced
								Security Training Certificate or have a valid AST exemption granted by the Registrar.
							</p>
						</li>

						<li>
							<div class="checklist-label">Authorization for protection dogs</div>
							<p class="checklist-info">
								To maintain authorization for use of dogs in security work, you must provide your Canine Security
								Validation for each dog.
							</p>
						</li>

						<li>
							<div class="checklist-label">Proof of authorization to work in Canada</div>
							<p class="checklist-info">
								You must provide proof that you are authorized to work in Canada.
								<a aria-label="Navigate to " [href]="swlAcceptedIdUrl" target="_blank"
									>See all accepted forms of identification.</a
								>
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
							<p class="checklist-info">
								All major credit cards are accepted through our secure online payment system.
							</p>
						</li>
					</ul>

					<mat-divider class="my-4"></mat-divider>
					<div class="fw-semibold fs-6 mb-2">For some applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Proof of fingerprinting</div>
							<p class="checklist-info">
								Applicants must have their fingerprints taken and submit proof of fingerprinting if they are not using
								their BC Services Card Login to renew their licence. Download the
								<a
									aria-label="Download Request for Fingerprinting form"
									download="Request For Fingerprinting Form"
									[href]="downloadFilePath"
									>Request for Fingerprinting form</a
								>, take it to your local police detachment or accredited fingerprinting agency, and return to this
								application once the form is completed.
							</p>
						</li>

						<li>
							<div class="checklist-label">If you are now a Peace Officer, provide a letter of no conflict</div>
							<p class="checklist-info">Your superior officer must write a letter of no conflict for you to upload.</p>
						</li>

						<li>
							<div class="checklist-label">If you have a mental health condition, provide a doctor's assessment.</div>
							<p class="checklist-info">
								Download the
								<a
									aria-label="Navigate to Mental Health Condition form"
									[href]="mentalHealthConditionsFormUrl"
									target="_blank"
								>
									Mental Health Condition form</a
								>, and give it to your doctor to fill out. You will need to upload the completed form.
							</p>
						</li>

						<li>
							<div class="checklist-label">If you have changed your name, proof of legal name change</div>
							<p class="checklist-info">
								You must upload one of the following documents: marriage certificate, certificate of name change, or a
								copy of your driver's licence/BCID with your new name.
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
export class StepWorkerLicenceChecklistRenewalComponent {
	canadianPassportPhotoUrl = SPD_CONSTANTS.urls.canadianPassportPhotoUrl;
	mentalHealthConditionsFormUrl = SPD_CONSTANTS.urls.mentalHealthConditionsFormUrl;
	downloadFilePath = SPD_CONSTANTS.files.requestForFingerprintingForm;
	swlLearnMoreUrl = SPD_CONSTANTS.urls.swlLearnMoreUrl;
	swlAcceptedIdUrl = SPD_CONSTANTS.urls.swlAcceptedIdUrl;
}
