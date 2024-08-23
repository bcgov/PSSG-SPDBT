import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-permit-checklist-new',
	template: `
		<app-step-section title="Checklist" subtitle="Make sure you have the following items before you continue">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<div class="fw-semibold fs-6">For all applicants:</div>

						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label">Proof of identity</span>
						</mat-checkbox>
						<p class="checklist-info">
							You will need to prove your identity by providing a valid piece of government-issued photo identification.
						</p>

						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label">Proof of citizenship or residence status</span>
						</mat-checkbox>
						<p class="checklist-info">
							You will need to prove your citizenship or residence status by providing a valid piece of
							government-issued identification, either from Canada or another country.
						</p>

						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label">Government-issued photo ID</span>
						</mat-checkbox>
						<p class="checklist-info">
							The identification needs to be issued by a federal, provincial, territorial or state government authority.
						</p>

						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label">Photograph of yourself for the permit</span>
						</mat-checkbox>
						<p class="checklist-info">
							You will need to upload a passport-quality photo of your face looking straight at the camera against a
							plain, white background. Uploading a photo that does not meet the criteria will delay your application's
							processing time. For further information on Passport Quality Photographs, please review the Government of
							Canada’s
							<a
								aria-label="Passport Quality Photographs information"
								href="https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html"
								target="_blank"
								>passport photograph requirements</a
							>.
						</p>

						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label">Credit card</span>
						</mat-checkbox>
						<p class="checklist-info">All major credit cards are accepted through our secure payment platform.</p>

						<mat-divider class="my-4"></mat-divider>
						<div class="fw-semibold fs-6">For some applicants:</div>

						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label">Expired permit (if applicable)</span>
						</mat-checkbox>
						<p class="checklist-info">
							If you have a Armoured Vehicle / Body Armour Permit that has expired, we can use the number and expiry
							date to connect this application to your file.
						</p>
					</form>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepPermitChecklistNewComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.formBuilder.group({
		checklistItem: new FormControl({ value: true, disabled: true }),
	});

	constructor(private formBuilder: FormBuilder) {}

	isFormValid(): boolean {
		return true;
	}
}
