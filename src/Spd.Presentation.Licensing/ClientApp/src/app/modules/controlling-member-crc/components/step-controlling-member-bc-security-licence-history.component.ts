import { Component, Input, OnInit } from '@angular/core';
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
		<app-step-section [heading]="title">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-7 col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="fw-semibold fs-6 mt-3">Criminal Charges, Convictions, or Lawsuits</div>
						<div class="fs-6 mt-3">{{ subtitle1 }}</div>

						<mat-radio-group aria-label="Select an option" formControlName="hasCriminalHistory">
							<div class="d-flex justify-content-start">
								<mat-radio-button class="w-auto radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-radio-button class="w-auto radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
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

						<div class="fs-6 mt-3">{{ subtitle2 }}</div>

						<mat-radio-group aria-label="Select an option" formControlName="hasCourtJudgement">
							<div class="d-flex justify-content-start">
								<mat-radio-button class="w-auto radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-radio-button class="w-auto radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</div>
						</mat-radio-group>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('hasCourtJudgement')?.dirty || form.get('hasCourtJudgement')?.touched) &&
								form.get('hasCourtJudgement')?.invalid &&
								form.get('hasCourtJudgement')?.hasError('required')
							"
							>This is required</mat-error
						>

						<div *ngIf="showCriminalHistoryDetails" @showHideTriggerSlideAnimation>
							<div class="mt-2">
								<mat-form-field
									><mat-label>
										<ng-container *ngIf="isYesAndNew; else yesAndUpdateLabel">Provide Details</ng-container>
										<ng-template #yesAndUpdateLabel>Brief Description of New Charges or Convictions</ng-template>
									</mat-label>
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
						</div>

						<ng-container *ngIf="isNew">
							<mat-divider class="mat-divider-primary mt-3"></mat-divider>

							<div class="fw-semibold fs-6 mt-3">Bankruptcy History</div>
							<div class="fs-6 mt-3">
								Have you ever been involved in a company that has filed for bankruptcy, is in the process of filing for
								bankruptcy, or currently has an ongoing bankruptcy?
							</div>

							<mat-radio-group aria-label="Select an option" formControlName="hasBankruptcyHistory">
								<div class="d-flex justify-content-start">
									<mat-radio-button class="w-auto radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-radio-button class="w-auto radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
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
						</ng-container>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class StepControllingMemberBcSecurityLicenceHistoryComponent
	implements OnInit, LicenceChildStepperStepComponent
{
	title = '';
	subtitle1 = '';
	subtitle2 = '';

	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.controllingMembersService.bcSecurityLicenceHistoryFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private controllingMembersService: ControllingMemberCrcService) {}

	ngOnInit(): void {
		this.title = this.isUpdate ? 'Confirm your business involvement' : 'Describe your business involvement';
		this.subtitle1 = this.isUpdate
			? 'Do you have any new criminal charges or convictions to declare?'
			: 'Have you or your business previously been charged or convicted of a criminal offence?';
		this.subtitle2 = this.isUpdate
			? 'Do you have any new court judgements in relation to a lawsuit to declare?'
			: 'Have you or your business ever received a court judgement in relation to a lawsuit?';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get hasCriminalHistory(): FormControl {
		return this.form.get('hasCriminalHistory') as FormControl;
	}
	get hasCourtJudgement(): FormControl {
		return this.form.get('hasCourtJudgement') as FormControl;
	}
	get hasBankruptcyHistory(): FormControl {
		return this.form.get('hasBankruptcyHistory') as FormControl;
	}
	get showCriminalHistoryDetails(): boolean {
		return (
			this.hasCriminalHistory.value === BooleanTypeCode.Yes || this.hasCourtJudgement.value === BooleanTypeCode.Yes
		);
	}
	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
	get isYesAndNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New && this.showCriminalHistoryDetails;
	}
	get isUpdate(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Update;
	}
}
