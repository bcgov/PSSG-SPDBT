import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LicenceFormStepComponent } from '../licence-application.component';

@Component({
	selector: 'app-checklist',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="Checklist"
					subtitle="Make sure you have the following items before you continue"
				></app-step-title>
				<div class="step-container row">
					<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<div class="checklist-heading">For all applicants:</div>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">Proof of fingerprinting request</span>
							</mat-checkbox>
							<p class="checklist-info">
								All applicants must submit a proof of fingerprinting request. Download the Request for Fingerprinting
								form, take it your local police department, and return to this application when you have this form
								completed.
							</p>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">Proof of training and experience</span>
							</mat-checkbox>
							<p class="checklist-info">
								Some categories of security workers, such as security guards, require proof of training or experience.
								Learn more​ about the types of documents we accept for each security worker category.
							</p>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">Proof of Canadian citizenship or ability to work in Canada</span>
							</mat-checkbox>
							<p class="checklist-info">
								See all accepted forms of identification on the Security Worker Licence requirements page.
							</p>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">Photograph of yourself for the licence</span>
							</mat-checkbox>
							<p class="checklist-info">
								You will need to upload a passport-quality photo of your face looking straight at the camera against a
								plain, white background. Uploading a photo that does not meet the criteria will delay your application's
								processing time. For further information on Passport Quality Photographs, please review the Government
								of Canada’s passport photograph requirements.
							</p>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">Credit card</span>
							</mat-checkbox>
							<p class="checklist-info">All major credit cards accepted through our secure payment platform.</p>

							<mat-divider class="my-4"></mat-divider>
							<div class="checklist-heading">For some applicants:</div>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">Expired licence (if applicable)</span>
							</mat-checkbox>
							<p class="checklist-info">
								If you have a Security Worker Licence that has expired, we can use the number and expiry date to connect
								this application to your file.
							</p>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">If you are a Peace Officer, provide a letter of no conflict</span>
							</mat-checkbox>
							<p class="checklist-info">Your superior officer must write a letter of no conflict for you to upload.</p>

							<mat-checkbox formControlName="checklistItem">
								<span class="checklist-label">
									If you have a mental health condition, provide a physician's assessment
								</span>
							</mat-checkbox>
							<p class="checklist-info">
								Download Mental Health Condition Form, and give it to your physician to fill out. You will need to
								upload the completed form.
							</p>
						</form>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.checklist-heading {
				font-weight: 400;
				font-size: 1.2em;
			}

			.checklist-label {
				font-weight: 400;
				font-size: 1.4em;
				color: var(--color-primary);
			}

			.checklist-info {
				margin-left: 2.6em;
			}
		`,
	],
})
export class ChecklistComponent implements LicenceFormStepComponent {
	form: FormGroup = this.formBuilder.group({
		checklistItem: new FormControl({ value: true, disabled: true }),
	});

	constructor(private formBuilder: FormBuilder) {}

	isFormValid(): boolean {
		return true;
	}

	getDataToSave(): any {
		return {};
	}
}
