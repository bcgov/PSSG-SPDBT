import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

@Component({
	selector: 'app-step-controlling-member-checklist-update',
	template: `
		<app-step-section
			heading="Checklist"
			subheading="Make sure you have the following items before you continue"
			info="<strong>Required documents depend on what updates you need to make to your licence</strong>"
		>
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
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
								If you now hold a position with peace officer status, provide a confirmation letter
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

						<li>
							<div class="checklist-label">If you have changed your name, proof of legal name change</div>
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
export class StepControllingMemberChecklistUpdateComponent {
	mentalHealthConditionsFormUrl = SPD_CONSTANTS.urls.mentalHealthConditionsFormUrl;
	downloadFilePath = SPD_CONSTANTS.files.requestForFingerprintingForm;
}
