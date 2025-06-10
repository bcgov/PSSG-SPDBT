import { Component } from '@angular/core';

@Component({
	selector: 'app-step-mdra-checklist-new',
	template: `
		<app-step-section title="Checklist" subtitle="Make sure you have the following items before you continue">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="fw-semibold fs-6 mb-2">For all applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Business contact information</div>
							<p class="checklist-info">
								Provide the business name, address, phone number, and email address (if available).
							</p>
						</li>
						<li>
							<div class="checklist-label">Business locations</div>
							<p class="checklist-info">Provide the address of each business location.</p>
						</li>
						<li>
							<div class="checklist-label">Business management</div>
							<p class="checklist-info">
								Identify the person or people responsible for the daily operations of the business.
							</p>
						</li>
						<li>
							<div class="checklist-label">Business documents</div>
							<p class="checklist-info">Include copies of your business registration documents.</p>
						</li>
					</ul>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepMdraChecklistNewComponent {}
