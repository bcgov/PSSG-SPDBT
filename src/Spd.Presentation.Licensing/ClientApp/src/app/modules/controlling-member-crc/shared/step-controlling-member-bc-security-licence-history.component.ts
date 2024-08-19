import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { ControllingMembersService } from '@app/core/services/controlling-members.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-controlling-member-bc-security-licence-history',
	template: `
		<app-step-section title="Describe your business involvement">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-7 col-xl-8 col-lg-12 mx-auto">
						<div class="fw-semibold fs-6">Criminal Charges, Convictions, or Lawsuits</div>
						<p>
							Have you or your business previously been charged, convicted, or received a court judgement in relation to
							a lawsuit?
						</p>
						<div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-12">
							<mat-radio-group aria-label="Select an option" formControlName="hasCriminalHistory">
								<div class="d-flex justify-content-start">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</div>
							</mat-radio-group>
						</div>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('hasCriminalHistory')?.dirty || form.get('hasCriminalHistory')?.touched) &&
								form.get('hasCriminalHistory')?.invalid &&
								form.get('hasCriminalHistory')?.hasError('required')
							"
							>This is required</mat-error
						>

						<div class="mt-2" *ngIf="hasCriminalHistory.value === booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
							<mat-form-field>
								<mat-label>Provide Details</mat-label>
								<textarea
									matInput
									formControlName="criminalHistoryDetail"
									style="min-height: 100px"
									[errorStateMatcher]="matcher"
									maxlength="250"
								></textarea>
								<mat-hint>Maximum 250 characters</mat-hint>
								<mat-error *ngIf="form.get('criminalHistoryDetail')?.hasError('required')">
									This is required
								</mat-error>
							</mat-form-field>
						</div>

						<mat-divider class="my-4 mat-divider-primary"></mat-divider>

						<div class="mt-4">
							<div class="fw-semibold fs-6">Bankruptcy History</div>
							<p>
								Have you previously been involved in a company that has declared bankruptcy, is in the process of
								declaring bankruptcy or currently have a bankruptcy in progress?
							</p>
							<div class="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-12">
								<mat-radio-group aria-label="Select an option" formControlName="hasBankruptcyHistory">
									<div class="d-flex justify-content-start">
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
										<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
									</div>
								</mat-radio-group>
							</div>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('hasBankruptcyHistory')?.dirty || form.get('hasBankruptcyHistory')?.touched) &&
									form.get('hasBankruptcyHistory')?.invalid &&
									form.get('hasBankruptcyHistory')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>

						<div
							class="mt-2"
							*ngIf="hasBankruptcyHistory.value === booleanTypeCodes.Yes"
							@showHideTriggerSlideAnimation
						>
							<mat-form-field>
								<mat-label>Provide Details</mat-label>
								<textarea
									matInput
									formControlName="bankruptcyHistoryDetail"
									style="min-height: 100px"
									[errorStateMatcher]="matcher"
									maxlength="250"
								></textarea>
								<mat-hint>Maximum 250 characters</mat-hint>
								<mat-error *ngIf="form.get('bankruptcyHistoryDetail')?.hasError('required')">
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
export class StepControllingMemberBcSecurityLicenceHistoryComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.controllingMembersService.bcSecurityLicenceHistoryFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private controllingMembersService: ControllingMembersService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get hasCriminalHistory(): FormControl {
		return this.form.get('hasCriminalHistory') as FormControl;
	}

	get hasBankruptcyHistory(): FormControl {
		return this.form.get('hasBankruptcyHistory') as FormControl;
	}

	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}
}
