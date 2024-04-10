import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { ApplicationTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-bc-branches',
	template: `
		<section class="step-section">
			<div class="step">
				<!-- <ng-container *ngIf="isRenewalOrUpdate">
					<app-common-update-renewal-alert
						[applicationTypeCode]="applicationTypeCode"
					></app-common-update-renewal-alert>
				</ng-container> -->

				<app-step-title title="Does your business have any branches in B.C.?"></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
							<mat-radio-group aria-label="Select an option" formControlName="hasBranchesInBc">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('hasBranchesInBc')?.dirty || form.get('hasBranchesInBc')?.touched) &&
									form.get('hasBranchesInBc')?.invalid &&
									form.get('hasBranchesInBc')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>

					<div class="row mt-4" *ngIf="hasBranchesInBc.value === booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
						<div class="col-xxl-10 col-xl-10 col-lg-8 col-md-8 col-sm-12 mx-auto">
							<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

							<div class="text-minor-heading mb-2">Branches in B.C.</div>
							<app-common-business-bc-branches [form]="form"></app-common-business-bc-branches>
						</div>
					</div>
				</form>
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class StepBusinessLicenceBcBranchesComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.businessApplicationService.branchesInBcFormGroup;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(MatSort) sort!: MatSort;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}

	get hasBranchesInBc(): FormControl {
		return this.form.get('hasBranchesInBc') as FormControl;
	}
}
