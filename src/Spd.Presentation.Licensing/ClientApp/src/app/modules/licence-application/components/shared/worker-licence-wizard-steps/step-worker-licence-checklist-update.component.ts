import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';

@Component({
	selector: 'app-step-worker-licence-checklist-update',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Checklist"
					subtitle="Make sure you have the following items before you continue"
					info="<strong>Required documents are dependant on what updates you need to make to your licence</strong>"
				></app-step-title>

				<div class="row">
					<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<div class="fw-semibold fs-6">For all applicants:</div>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">Proof of training and experience</span>
							</mat-checkbox>
							<p class="checklist-info">
								Some categories of security workers, such as security guards, require proof of training or experience.
								<a href="https://www2.gov.bc.ca/gov/content/home" target="_blank">Learn more</a>&nbsp;about the types of
								documents we accept for each security worker category.
							</p>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label"
									>If you want to replace the photograph on your licence, provide a new photograph</span
								>
							</mat-checkbox>
							<p class="checklist-info">
								You can upload a new passport-quality photo of your face looking straight at the camera against a plain,
								white background. For further information on Passport Quality Photographs, please review the Government
								of Canada’s
								<a
									href="https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html"
									target="_blank"
									>passport photograph requirements</a
								>.
							</p>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">If you are now a Peace Officer, provide a letter of no conflict</span>
							</mat-checkbox>
							<p class="checklist-info">Your superior officer must write a letter of no conflict for you to upload.</p>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">
									If you have a new mental health condition, provide a physician's assessment
								</span>
							</mat-checkbox>
							<p class="checklist-info">
								Download the
								<a
									aria-label="Mental Health Condition form"
									href="https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/workers/forms"
									target="_blank"
								>
									Mental Health Condition form</a
								>, and give it to your physician to fill out. You will need to upload the completed form.
							</p>
							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">If you have changed your name, proof of legal name change</span>
							</mat-checkbox>
							<p class="checklist-info">
								You must upload one of the following documents: marriage certificate, certificate of name change, or a
								copy of your driver's licence/BCID with new name.
							</p>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">Credit card</span>
							</mat-checkbox>
							<p class="checklist-info">All major credit cards accepted through our secure payment platform.</p>
						</form>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceChecklistUpdateComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.formBuilder.group({
		checklistItem: new FormControl({ value: true, disabled: true }),
	});

	constructor(private formBuilder: FormBuilder) {}

	isFormValid(): boolean {
		return true;
	}
}
