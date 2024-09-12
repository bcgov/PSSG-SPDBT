import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-controlling-member-bc-security-licence-history',
	template: `
		<app-step-section [title]="title">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-md-8 col-sm-12 mx-auto">
						<div class="fw-semibold fs-6 text-center mt-3">Criminal Charges, Convictions, or Lawsuits</div>
						<div class="fs-6 text-center mt-3">{{ subtitle }}</div>
					</div>
				</div>

				<div class="row">
					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<mat-radio-group aria-label="Select an option" formControlName="hasCriminalHistory">
							<div class="d-flex justify-content-start">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</div>
						</mat-radio-group>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('hasCriminalHistory')?.dirty || form.get('hasCriminalHistory')?.touched) &&
								form.get('hasCriminalHistory')?.invalid &&
								form.get('hasCriminalHistory')?.hasError('required')
							"
							>This is required</mat-error
						>
					</div>
				</div>

				<div class="row">
					<div class="col-xxl-7 col-xl-8 col-lg-12 mx-auto">
						<div class="mt-2" *ngIf="isYesAndNew" @showHideTriggerSlideAnimation>
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

						<div class="mt-2" *ngIf="isYesAndUpdate" @showHideTriggerSlideAnimation>
							<mat-form-field>
								<mat-label>Brief Description of New Charges or Convictions</mat-label>
								<textarea
									matInput
									formControlName="criminalChargeDescription"
									style="min-height: 200px"
									maxlength="1000"
									[errorStateMatcher]="matcher"
								></textarea>
								<mat-hint>Maximum 1000 characters</mat-hint>
								<mat-error *ngIf="form.get('criminalChargeDescription')?.hasError('required')">
									This is required
								</mat-error>
							</mat-form-field>
						</div>
					</div>
				</div>

				<ng-container *ngIf="isNew">
					<div class="row mt-4">
						<div class="col-md-8 col-sm-12 mx-auto">
							<mat-divider class="mat-divider-primary"></mat-divider>

							<div class="fw-semibold text-center fs-6 mt-3">Bankruptcy History</div>
							<div class="fs-6 text-center mt-3">
								Have you previously been involved in a company that has declared bankruptcy, is in the process of
								declaring bankruptcy or currently have a bankruptcy in progress?
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
							<mat-radio-group aria-label="Select an option" formControlName="hasBankruptcyHistory">
								<div class="d-flex justify-content-start">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</div>
							</mat-radio-group>
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
					</div>

					<div
						class="row mt-2"
						*ngIf="hasBankruptcyHistory.value === booleanTypeCodes.Yes"
						@showHideTriggerSlideAnimation
					>
						<div class="col-xxl-7 col-xl-8 col-lg-12 mx-auto">
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
				</ng-container>
			</form>
		</app-step-section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class StepControllingMemberBcSecurityLicenceHistoryComponent implements LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.controllingMembersService.bcSecurityLicenceHistoryFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private controllingMembersService: ControllingMemberCrcService) {}

	ngOnInit(): void {
		this.title = this.isUpdate ? 'Confirm your business involvement' : 'Describe your business involvement';
		this.subtitle = this.isUpdate
			? 'Do you have any new criminal charges or convictions to declare?'
			: 'Have you or your business previously been charged, convicted, or received a court judgement in relation to a lawsuit?';
	}
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

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
	get isYesAndNew(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.New && this.hasCriminalHistory.value === BooleanTypeCode.Yes
		);
	}
	get isYesAndUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Update && this.hasCriminalHistory.value === BooleanTypeCode.Yes
		);
	}

	get isUpdate(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Update;
	}
}
