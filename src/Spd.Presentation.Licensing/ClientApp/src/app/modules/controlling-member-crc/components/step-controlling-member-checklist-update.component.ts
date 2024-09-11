import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-controlling-member-checklist-update',
	template: `
		<app-step-section
			title="Checklist"
			subtitle="Make sure you have the following items before you continue"
			info="<strong>Required documents depend on what updates you need to make to your licence</strong>"
		>
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label">Proof of fingerprinting request</span>
						</mat-checkbox>
						<p class="checklist-info">
							If you reside in Canada, you must submit a proof of fingerprinting request. Download the
							<a
								aria-label="Request for Fingerprinting form"
								download="Request For Fingerprinting Form"
								[href]="downloadFilePath"
								>Request for Fingerprinting form</a
							>, take it your local police department, and return to this application when you have this form completed.
						</p>

						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label"
								>If you now hold a position with peace officer status, provide a confirmation letter</span
							>
						</mat-checkbox>
						<p class="checklist-info">Your superior officer must write a confirmation letter for you to upload.</p>

						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label">
								If you are now being treated for a mental health condition, provide a physician's assessment
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
					</form>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepControllingMemberChecklistUpdateComponent implements LicenceChildStepperStepComponent {
	downloadFilePath = SPD_CONSTANTS.files.requestForFingerprintingForm;

	form: FormGroup = this.formBuilder.group({
		checklistItem: new FormControl({ value: true, disabled: true }),
	});

	constructor(private formBuilder: FormBuilder) {}

	isFormValid(): boolean {
		return true;
	}
}
