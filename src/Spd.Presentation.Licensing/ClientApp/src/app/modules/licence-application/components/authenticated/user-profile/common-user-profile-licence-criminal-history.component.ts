import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-common-user-profile-licence-criminal-history',
	template: `
		<div class="text-minor-heading pt-2">Criminal History</div>
		<div class="py-2">{{ title }}</div>

		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12">
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

			<div class="row mt-4" *ngIf="isYesAndUpdate" @showHideTriggerSlideAnimation>
				<div class="col-12">
					<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
					<div class="text-minor-heading mb-2">Brief description of the new charges or convictions</div>
					<mat-form-field>
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
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class CommonUserProfileLicenceCriminalHistoryComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	booleanTypeCodes = BooleanTypeCode;

	matcher = new FormErrorStateMatcher();

	@Input() form!: FormGroup;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		if (
			this.applicationTypeCode === ApplicationTypeCode.Update ||
			this.applicationTypeCode === ApplicationTypeCode.Renewal
		) {
			this.title = 'Do you have any new criminal charges or convictions?';
		} else {
			this.title = 'Have you previously been charged or convicted of a crime?';
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get hasCriminalHistory(): FormControl {
		return this.form.get('hasCriminalHistory') as FormControl;
	}
	get criminalChargeDescription(): FormControl {
		return this.form.get('criminalChargeDescription') as FormControl;
	}
	get isYesAndUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Update && this.hasCriminalHistory.value === BooleanTypeCode.Yes
		);
	}
}
