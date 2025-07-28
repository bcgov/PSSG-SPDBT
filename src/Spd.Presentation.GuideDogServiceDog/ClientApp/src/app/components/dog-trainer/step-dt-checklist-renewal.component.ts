import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

@Component({
	selector: 'app-step-dt-checklist-renewal',
	template: `
		<app-step-section heading="Checklist" subheading="Make sure you have the following items before you continue">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<p>
						Please note: The registrar will <b>not</b> issue or renew a dog trainer certificate unless the individual
						identified in the application trains dogs on behalf of an accredited training school for the purpose of the
						dogs becoming guide dogs or service dogs. Dog trainer applications are submitted by accredited training
						schools.
					</p>
					<div class="fw-semibold fs-6 mb-2">For all applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Dog trainer’s government-issued photo ID</div>
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
							<div class="checklist-label">Photograph of dog trainer for the certificate</div>
							<p class="checklist-info">
								A clear photo of the dog trainer’s face, looking straight at the camera, with a plain, white background.
							</p>
						</li>
						<li>
							<div class="checklist-label">Written confirmation from the accredited school</div>
							<p class="checklist-info">
								Confirming that the dog trainer trains dogs on behalf of the accredited or recognized school for the
								purpose of the dogs becoming guide or service dogs.
							</p>
							<p class="checklist-info">
								This may include a letter or email from the Chief Executive Officer/Executive Director or equivalent
								confirming this.
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
