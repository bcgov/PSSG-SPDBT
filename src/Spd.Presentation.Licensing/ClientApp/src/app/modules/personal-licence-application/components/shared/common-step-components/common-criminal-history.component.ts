import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-common-criminal-history',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12" [ngClass]="isWizardStep ? 'mx-auto' : ''">
					<mat-radio-group aria-label="Select an option" formControlName="hasCriminalHistory">
						<div [ngClass]="isWizardStep ? '' : 'd-flex justify-content-start'">
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
							@if (isWizardStep) {
								<mat-divider class="my-2"></mat-divider>
							}
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</div>
					</mat-radio-group>
					@if (
						(form.get('hasCriminalHistory')?.dirty || form.get('hasCriminalHistory')?.touched) &&
						form.get('hasCriminalHistory')?.invalid &&
						form.get('hasCriminalHistory')?.hasError('required')
					) {
						<mat-error class="mat-option-error">This is required</mat-error>
					}
				</div>
			</div>

			@if (isYesAndUpdate) {
				<div class="row mt-4" @showHideTriggerSlideAnimation>
					<div [ngClass]="isWizardStep ? 'offset-md-2 col-md-8 col-sm-12' : 'col-12'">
						<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
						<div class="text-minor-heading mb-2">Brief Description of New Charges or Convictions</div>
						<div class="fs-6 mb-2">You have 14 days to report new charges or convictions to our office.</div>
						<mat-form-field>
							<textarea
								matInput
								formControlName="criminalChargeDescription"
								style="min-height: 200px"
								maxlength="1000"
								[errorStateMatcher]="matcher"
							></textarea>
							<mat-hint>Maximum 1000 characters</mat-hint>
							@if (form.get('criminalChargeDescription')?.hasError('required')) {
								<mat-error>This is required</mat-error>
							}
						</mat-form-field>
					</div>
				</div>
			}
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class CommonCriminalHistoryComponent {
	matcher = new FormErrorStateMatcher();
	booleanTypeCodes = BooleanTypeCode;

	@Input() form!: FormGroup;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() isWizardStep = false;

	get isYesAndUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Update && this.hasCriminalHistory.value === BooleanTypeCode.Yes
		);
	}
	get hasCriminalHistory(): FormControl {
		return this.form.get('hasCriminalHistory') as FormControl;
	}
}
