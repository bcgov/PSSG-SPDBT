import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '../../../services/licence-application.helper';

@Component({
	selector: 'app-step-checklist-renewal-worker',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Checklist"
					subtitle="Make sure you have the following items before you continue"
				></app-step-title>
				<div class="step-container">
					<div class="row">
						<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
							<form [formGroup]="form" novalidate>
								<div class="fw-semibold fs-6">For all applicants:</div>

								<mat-checkbox formControlName="checklistItem">
									<span class="checklist-label">Authorization to Carry (ATC)</span>
								</mat-checkbox>
								<p class="checklist-info">
									If you are renewing your Armoured Car Guard licence, you must provide a new ATC document.
								</p>

								<mat-checkbox formControlName="checklistItem">
									<span class="checklist-label">Restraint authorization</span>
								</mat-checkbox>
								<p class="checklist-info">
									If you want to maintain your restraint authorization, you must provide your advanced security training
									certificate or proof of training as correction officer or peace officer in last three years.
								</p>

								<mat-checkbox formControlName="checklistItem">
									<span class="checklist-label">Dogs for protection authorization</span>
								</mat-checkbox>
								<p class="checklist-info">
									If you want to maintain your restraint authorization for use of dogs for protection, you must provide
									your Canine Security Validation for each dog.
								</p>

								<mat-checkbox formControlName="checklistItem">
									<span class="checklist-label">Proof of ability to work in Canada</span>
								</mat-checkbox>
								<p class="checklist-info">
									You must supply proof of ability to work in Canada. See all accepted forms of identification on the
									Security Worker Licence requirements page.
								</p>

								<mat-checkbox formControlName="checklistItem">
									<span class="checklist-label">Credit card</span>
								</mat-checkbox>
								<p class="checklist-info">All major credit cards accepted through our secure payment platform.</p>

								<mat-divider class="my-4"></mat-divider>
								<div class="fw-semibold fs-6">For some applicants:</div>

								<mat-checkbox formControlName="checklistItem">
									<span class="checklist-label">If you are now a Peace Officer, provide a letter of no conflict</span>
								</mat-checkbox>
								<p class="checklist-info">
									Your superior officer must write a letter of no conflict for you to upload.
								</p>

								<mat-checkbox formControlName="checklistItem">
									<span class="checklist-label">
										If you have a mental health condition, provide a physician's assessment
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
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepChecklistRenewalWorkerComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.formBuilder.group({
		checklistItem: new FormControl({ value: true, disabled: true }),
	});

	constructor(private formBuilder: FormBuilder) {}

	isFormValid(): boolean {
		return true;
	}
}
