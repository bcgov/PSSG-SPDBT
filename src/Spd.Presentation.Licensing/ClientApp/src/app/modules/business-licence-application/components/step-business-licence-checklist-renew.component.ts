import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-business-licence-checklist-renew',
	template: `
		<app-step-section title="Checklist" subtitle="Make sure you have the following items before you continue">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<div class="fw-semibold fs-6">For all applicants:</div>

						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label">Proof of insurance</span>
						</mat-checkbox>
						<p class="checklist-info">
							You will need to provide proof of this security business’s valid general liability insurance of not less
							than $1 million coverage.
						</p>

						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label">Credit card</span>
						</mat-checkbox>
						<p class="checklist-info">All major credit cards are accepted through our secure payment platform.</p>

						<mat-divider class="my-4"></mat-divider>
						<div class="fw-semibold fs-6">For some applicants:</div>

						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label">If your business's branding has changed, provide new images</span>
						</mat-checkbox>
						<p class="checklist-info">
							Provide examples of your business's logo or branding on uniforms, advertising, vehicles, business cards,
							etc.
						</p>

						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label">If your business name has changed, proof of legal name change</span>
						</mat-checkbox>
						<p class="checklist-info">You must upload documentation of legal business name change.</p>

						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label">New employee security worker licence information</span>
						</mat-checkbox>
						<p class="checklist-info">
							If you have new employees, provide their names and valid Security Worker Licence numbers.
						</p>

						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label">New controlling member security worker licence information</span>
						</mat-checkbox>
						<p class="checklist-info">
							You will need to provide a valid Security Worker Licence for each new
							<a
								aria-label="controlling member of your business"
								href="https://www2.gov.bc.ca/gov/content?id=F8B3EE1C1BAE4E07BC88BF0E787D67B4"
								target="_blank"
								>controlling member of your business</a
							>. If they don't have a valid licence, provide their email address so they can consent to a criminal
							record check.
						</p>

						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label"
								>If you are applying for an Armoured Car Guard licence, provide documentation</span
							>
						</mat-checkbox>
						<p class="checklist-info">
							You will need to provide proof you own, lease or rent an approved armoured car; proof of liability
							insurance; and a
							<a
								aria-label="safety certificate"
								href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/10_207_2008#section4"
								target="_blank"
								>safety certificate</a
							>.
						</p>

						<mat-checkbox formControlName="checklistItem">
							<span class="checklist-label"
								>If you are applying for an Authorization for use of dogs, provide proof of qualification</span
							>
						</mat-checkbox>
						<p class="checklist-info">You will need to provide a Security Dog Validation Certificate for each dog.</p>
					</form>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepBusinessLicenceChecklistRenewComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.formBuilder.group({
		checklistItem: new FormControl({ value: true, disabled: true }),
	});

	constructor(private formBuilder: FormBuilder) {}

	isFormValid(): boolean {
		return true;
	}
}
