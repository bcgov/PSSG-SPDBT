import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

@Component({
	selector: 'app-step-controlling-member-checklist-new',
	template: `
		<app-step-section heading="Checklist" subheading="Make sure you have the following items before you continue">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="fw-semibold fs-6 mb-2">For all applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Proof of identity</div>
							<p class="checklist-info">
								See all accepted forms of identification for
								<a [href]="controllingMemberChecklistUrl" target="_blank">controlling members</a>.
							</p>
						</li>
					</ul>

					<mat-divider class="my-4"></mat-divider>
					<div class="fw-semibold fs-6 mb-2">For some applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Proof of fingerprinting</div>
							<p class="checklist-info">
								All applicants who reside in Canada must have their fingerprints taken and submit proof of
								fingerprinting. Download the
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
							<div class="checklist-label">
								If you are a volunteer auxiliary or reserve constable, a peace officer, or retired from a police force,
								you must provide a confirmation letter
							</div>
							<p class="checklist-info">Your superior officer must write a confirmation letter for you to upload.</p>
						</li>

						<li>
							<div class="checklist-label">If you have a mental health condition, provide a doctor's assessment</div>
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
					</ul>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepControllingMemberChecklistNewComponent {
	controllingMemberChecklistUrl = SPD_CONSTANTS.urls.controllingMemberChecklistUrl;
	mentalHealthConditionsFormUrl = SPD_CONSTANTS.urls.mentalHealthConditionsFormUrl;
	downloadFilePath = SPD_CONSTANTS.files.requestForFingerprintingForm;
}
