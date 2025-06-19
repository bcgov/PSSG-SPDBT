import { Component } from '@angular/core';

@Component({
	selector: 'app-step-mdra-checklist-update',
	template: `
		<app-step-section title="Checklist" subtitle="Make sure you have the following items before you continue">
			<div class="row">
				<div class="col-xxl-4 col-xl-6 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="fw-semibold fs-6 mb-2">For all applicants:</div>
					<ul>
						<li>
							<div class="checklist-label">Business contact information</div>
							<p class="checklist-info">Provide the business names and address.</p>
						</li>
						<li>
							<div class="checklist-label">Business locations</div>
							<p class="checklist-info">Provide the address of each business location.</p>
						</li>
					</ul>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepMdraChecklistUpdateComponent {}
