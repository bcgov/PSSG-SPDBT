import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { ControllingMembersService } from '@app/core/services/controlling-members.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-controlling-members-bc-security-licence-history',
	template: `
		<app-step-section title="Describe your business involvement">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-7 col-xl-8 col-lg-12 mx-auto">
						<div class="fw-semibold fs-6">Criminal charges, convictions, or lawsuits</div>
						<p>
							Have you or your business previously been charged, convicted, or received a court judgement in relation to
							a lawsuit?
						</p>
						<div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-12">
							<mat-radio-group aria-label="Select an option" formControlName="isChargeHistory">
								<div class="d-flex justify-content-start">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</div>
							</mat-radio-group>
						</div>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('isChargeHistory')?.dirty || form.get('isChargeHistory')?.touched) &&
								form.get('isChargeHistory')?.invalid &&
								form.get('isChargeHistory')?.hasError('required')
							"
							>This is required</mat-error
						>

						<div class="mt-2" *ngIf="isChargeHistory.value === booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
							<mat-form-field>
								<mat-label>Provide Details</mat-label>
								<textarea
									matInput
									formControlName="chargeHistoryDetails"
									style="min-height: 100px"
									[errorStateMatcher]="matcher"
									maxlength="250"
								></textarea>
								<mat-hint>Maximum 250 characters</mat-hint>
								<mat-error *ngIf="form.get('chargeHistoryDetails')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>

						<div class="mt-4">
							<div class="fw-semibold fs-6">Bankruptcy history</div>
							<p>
								Have you previously been involved in a company that has declared bankruptcy, is in the process of
								declaring bankruptcy or currently have a bankruptcy in progress?
							</p>
							<div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-12">
								<mat-radio-group aria-label="Select an option" formControlName="isBankruptcyHistory">
									<div class="d-flex justify-content-start">
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
									</div>
								</mat-radio-group>
							</div>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('isBankruptcyHistory')?.dirty || form.get('isBankruptcyHistory')?.touched) &&
									form.get('isBankruptcyHistory')?.invalid &&
									form.get('isBankruptcyHistory')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>

						<div class="mt-2" *ngIf="isBankruptcyHistory.value === booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
							<mat-form-field>
								<mat-label>Provide Details</mat-label>
								<textarea
									matInput
									formControlName="bankruptcyHistoryDetails"
									style="min-height: 100px"
									[errorStateMatcher]="matcher"
									maxlength="250"
								></textarea>
								<mat-hint>Maximum 250 characters</mat-hint>
								<mat-error *ngIf="form.get('bankruptcyHistoryDetails')?.hasError('required')">
									This is required
								</mat-error>
							</mat-form-field>
						</div>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class StepControllingMembersBcSecurityLicenceHistoryComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.controllingMembersService.bcSecurityLicenceHistoryFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private controllingMembersService: ControllingMembersService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isChargeHistory(): FormControl {
		return this.form.get('isChargeHistory') as FormControl;
	}

	get isBankruptcyHistory(): FormControl {
		return this.form.get('isBankruptcyHistory') as FormControl;
	}

	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}
}
