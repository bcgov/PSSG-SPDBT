import { Component, Input } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

@Component({
	selector: 'app-step-permit-checklist-new',
	template: `
		<app-step-section heading="Checklist" subheading="Make sure you have the following items before you continue">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="fw-semibold fs-6 mb-2">For all applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Proof of citizenship or residence status</div>
							<p class="checklist-info">
								You are required to provide documentation verifying your Canadian citizenship or residency status as
								part of the application process.
							</p>
						</li>

						<li>
							<div class="checklist-label">Photograph of yourself for the permit</div>
							<p class="checklist-info">
								You will need to upload a passport-quality photo of your face looking at the camera, with a plain, white
								background. Uploading a photo that doesn't meet these requirements will delay the processing of your
								application. For more details on passport-quality photos, please refer to the
								<a
									aria-label="Navigate to Government of Canada's passport photograph guidelines"
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
							<div class="checklist-label">Expired permit (if applicable)</div>
							<p class="checklist-info">
								If you have a Armoured Vehicle / Body Armour Permit that has expired, we can use the number and expiry
								date to connect this application to your file.
							</p>
						</li>
					</ul>

					<ng-container *ngIf="isBodyArmourPermit">
						<mat-divider class="my-4"></mat-divider>
						<div class="fw-semibold fs-6 mb-2">Before continuing your application, please review the following:</div>
						<ul>
							<li class="checklist-info">
								If there is an imminent risk to your safety, you may wish to apply for a
								<a
									aria-label="Navigate to Application for a 90-day EXEMPTION"
									[href]="bodyArmourPermit90ExemptionApplicationUrl"
									target="_blank"
									>90-day exemption</a
								>
								from the requirement to have a body armour permit.
							</li>
							<li class="checklist-info">
								Individuals who hold a valid security worker licence as an armoured car guard, private investigator,
								security consultant, security guard, or body armour salesperson do not need a permit to possess body
								armour while in the course of their employment.
							</li>
							<li class="checklist-info">
								Peace officers, government employees, and security guards at gaming facilities (who are registered
								gaming workers) do not need a permit to possess body armour while in the course of their employment.
							</li>
							<li class="checklist-info">
								Individuals who hold a valid licence issued under the
								<a aria-label="Navigate to Firearms Act" [href]="firearmsActUrl" target="_blank">Firearms Act</a>
								authorizing them to acquire or possess a firearm do not need a body armour permit.
							</li>
							<li class="checklist-info">
								If you are unsure if you require a permit, please
								<a aria-label="Navigate to SPD contact" [href]="bodyArmourSpdContactUrl" target="_blank">contact</a>
								our office.
							</li>
						</ul>
					</ng-container>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepPermitChecklistNewComponent {
	bodyArmourSpdContactUrl = SPD_CONSTANTS.urls.bodyArmourSpdContactUrl;
	bodyArmourPermit90ExemptionApplicationUrl = SPD_CONSTANTS.urls.bodyArmourPermit90ExemptionApplicationUrl;
	firearmsActUrl = SPD_CONSTANTS.urls.firearmsActUrl;
	canadianPassportPhotoUrl = SPD_CONSTANTS.urls.canadianPassportPhotoUrl;

	@Input() isBodyArmourPermit!: boolean;
}
