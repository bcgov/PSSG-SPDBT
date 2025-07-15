import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

@Component({
	selector: 'app-step-team-checklist-new',
	template: `
		<app-step-section heading="Checklist" subheading="Make sure you have the following items before you continue">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="fw-semibold fs-6 mb-2">For all applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Photograph of yourself for the certificate</div>
							<p class="checklist-info">
								A clear photo of your face, looking straight at the camera, with a plain, white background.
							</p>
							<p class="checklist-info">
								We understand this may be difficult for some applicants. If you are not able to provide this type of
								photo, please contact us and we can help find another option.
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
							<div class="checklist-label">Dog information</div>
							<p class="checklist-info">
								Be prepared to provide a description of your dog, including their colour, breed, and date of birth.
							</p>
						</li>
					</ul>

					<mat-divider class="my-4"></mat-divider>
					<div class="fw-semibold fs-6 mb-2">For some applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Proof of training and experience from an accredited school</div>
							<p class="checklist-info">
								We require proof of training and/or experience from an accredited school, including a copy of the
								identification card issued by that school.
							</p>
						</li>
						<li>
							<div class="checklist-label">Medical information</div>
							<p class="checklist-info">
								Non-accredited teams must have the
								<a [href]="medicalFormUrl" target="_blank"
									>Medical Form Confirming Requirement for Guide Dog or Service Dog</a
								>
								completed by a physician or nurse practitioner licensed in Canada or the United States. The exam date
								must be within the past six months.
							</p>
						</li>
						<li>
							<div class="checklist-label">Microchip number</div>
							<p class="checklist-info">
								Providing a Microchip Number is optional, however, is helpful for the program.
							</p>
						</li>
						<li>
							<div class="checklist-label">Dog medical information</div>
							<p class="checklist-info">
								Non-accredited teams must provide proof from a B.C. veterinarian (or a Canadian or American veterinarian
								equivalent) confirming that your dog has been spayed or neutered.
							</p>
						</li>
						<li>
							<div class="checklist-label">Child handlers</div>
							<div class="checklist-info">
								<ul>
									<li>
										Please include the child’s birth certificate, along with a parent’s government-issued photo ID and
										signature.
									</li>
									<li>
										The child will complete the assessment with their dog. A parent or guardian may accompany them for
										support.
									</li>
								</ul>
							</div>
						</li>
					</ul>
					<p>
						If your documents are complete and your team is not from an accredited school, Security Programs will direct
						you to
						<a aria-label="Navigate to Obedience Unleashed Dog Training site" [href]="oudtUrl" target="_blank"
							>Obedience Unleashed Dog Training (OUDT)</a
						>
						for a public safety assessment once we have processed your file.
					</p>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepTeamChecklistNewComponent {
	canadianPassportPhotoUrl = SPD_CONSTANTS.urls.canadianPassportPhotoUrl;
	oudtUrl = SPD_CONSTANTS.urls.oudtUrl;
	medicalFormUrl = SPD_CONSTANTS.urls.medicalFormUrl;
}
