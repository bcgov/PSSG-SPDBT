import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

@Component({
	selector: 'app-step-worker-licence-checklist-update',
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
							<div class="checklist-label">Proof of training and experience</div>
							<p class="checklist-info">
								If you are adding a new category to your licence, you may need to provide proof of training and/or
								experience. <a aria-label="Navigate to " [href]="swlLearnMoreUrl" target="_blank">Learn more</a> about
								the types of documents we accept for each security worker category.
							</p>
						</li>

						<li>
							<div class="checklist-label">
								If you want to replace the photograph on your licence, provide a new photograph
							</div>
							<p class="checklist-info">
								You can upload a new passport-quality photo of your face looking at the camera, with a plain, white
								background.
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
								copy of your driver's licence/BCID with new name.
							</p>
						</li>

						<li>
							<div class="checklist-label">Credit card</div>
							<p class="checklist-info">
								Updates to your legal name, licence category, authorization to use restraints or dogs, and licence
								photograph have a $20 fee. All major credit cards are accepted through our secure online payment system.
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
export class StepWorkerLicenceChecklistUpdateComponent {
	mentalHealthConditionsFormUrl = SPD_CONSTANTS.urls.mentalHealthConditionsFormUrl;
	swlLearnMoreUrl = SPD_CONSTANTS.urls.swlLearnMoreUrl;
}
