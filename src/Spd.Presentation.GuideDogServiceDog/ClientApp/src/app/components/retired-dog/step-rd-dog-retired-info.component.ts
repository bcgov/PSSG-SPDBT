import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-rd-dog-retired-info',
	template: `
		<app-step-section heading="When was your dog retired from service?">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-5 col-xl-6 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<mat-form-field>
							<mat-label>Date of Retirement</mat-label>
							<input
								matInput
								formControlName="dogRetiredDate"
								[mask]="dateMask"
								[showMaskTyped]="true"
								[errorStateMatcher]="matcher"
								(blur)="onValidateDate()"
								aria-label="Date in format YYYY-MM-DD"
							/>
							<!-- We always want the date format hint to display -->
							@if (!showHintError) {
								<mat-hint>Date format YYYY-MM-DD</mat-hint>
							}
							@if (showHintError) {
								<mat-error>
									<span class="hint-inline">Date format YYYY-MM-DD</span>
								</mat-error>
							}
							@if (dogRetiredDate.hasError('required')) {
								<mat-error>This is required</mat-error>
							}
							@if (dogRetiredDate.hasError('invalidDate')) {
								<mat-error>This date is invalid</mat-error>
							}
							@if (dogRetiredDate.hasError('futureDate')) {
								<mat-error>This date cannot be in the future</mat-error>
							}
						</mat-form-field>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [
		`
			.hint-inline {
				font-size: 12px;
				color: rgba(0, 0, 0, 0.6);
			}
		`,
	],
	standalone: false,
})
export class StepRdDogRetiredInfoComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.retiredDogApplicationService.dogRetiredForm;

	dateMask = SPD_CONSTANTS.date.dateMask;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(
		private utilService: UtilService,
		private retiredDogApplicationService: RetiredDogApplicationService
	) {}

	onValidateDate(): void {
		const errorKey = this.utilService.getIsInputValidDate(this.dogRetiredDate.value, true);
		if (errorKey) {
			this.dogRetiredDate.setErrors({ [errorKey]: true });
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
	get showHintError(): boolean {
		return (this.dogRetiredDate?.dirty || this.dogRetiredDate?.touched) && this.dogRetiredDate?.invalid;
	}
	get dogRetiredDate(): FormControl {
		return this.form.get('dogRetiredDate') as FormControl;
	}
}
