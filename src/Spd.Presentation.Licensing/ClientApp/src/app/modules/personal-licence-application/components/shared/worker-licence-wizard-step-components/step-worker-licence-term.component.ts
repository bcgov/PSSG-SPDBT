import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceFeeResponse, WorkerLicenceTypeCode } from '@app/api/models';
import { LicenceApplicationService } from '@app/modules/personal-licence-application/licence-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';
import { CommonApplicationService } from '@app/shared/services/common-application.service';

@Component({
	selector: 'app-step-worker-licence-term',
	template: `
		<app-step-section
			title="Select your licence term"
			subtitle="The licence term will apply to all licence categories"
			[isRenewalOrUpdate]="applicationTypeCode === applicationTypeCodes.Renewal"
			[workerLicenceTypeCode]="workerLicenceTypes.SecurityWorkerLicence"
		>
			<div class="row">
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<mat-radio-group aria-label="Select an option" formControlName="licenceTermCode">
							<ng-container *ngFor="let term of termCodes; let i = index; let last = last">
								<mat-radio-button class="radio-label" [value]="term.licenceTermCode">
									{{ term.licenceTermCode | options : 'LicenceTermTypes' }} ({{
										term.amount | currency : 'CAD' : 'symbol-narrow' : '1.0'
									}})
								</mat-radio-button>
								<mat-divider *ngIf="!last" class="my-2"></mat-divider>
							</ng-container>
						</mat-radio-group>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('licenceTermCode')?.dirty || form.get('licenceTermCode')?.touched) &&
								form.get('licenceTermCode')?.invalid &&
								form.get('licenceTermCode')?.hasError('required')
							"
							>This is required</mat-error
						>
					</form>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepWorkerLicenceTermComponent implements LicenceChildStepperStepComponent {
	workerLicenceTypes = WorkerLicenceTypeCode;
	applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.licenceApplicationService.licenceTermFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(
		private licenceApplicationService: LicenceApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get termCodes(): Array<LicenceFeeResponse> {
		const workerLicenceTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
			'workerLicenceTypeData.workerLicenceTypeCode'
		)?.value;

		const applicationTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
			'applicationTypeData.applicationTypeCode'
		)?.value;

		const bizTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
			'soleProprietorData.bizTypeCode'
		)?.value;

		const originalLicenceTermCode = this.licenceApplicationService.licenceModelFormGroup.get(
			'originalLicenceData.originalLicenceTermCode'
		)?.value;

		// console.debug(
		// 	'get termCodes',
		// 	workerLicenceTypeCode,
		// 	applicationTypeCode,
		// 	bizTypeCode,
		// 	originalLicenceTermCode
		// );

		if (!workerLicenceTypeCode || !applicationTypeCode || !bizTypeCode) {
			return [];
		}

		// let hasValidSwl90DayLicence = false;
		// if (applicationTypeCode === ApplicationTypeCode.Renewal && originalLicenceTermCode === LicenceTermCode.NinetyDays) {
		// 	hasValidSwl90DayLicence = true;
		// }

		// console.debug(
		// 	'get termCodes',
		// 	workerLicenceTypeCode,
		// 	applicationTypeCode,
		// 	bizTypeCode,
		// 	originalLicenceTermCode,
		// 	hasValidSwl90DayLicence
		// );

		return this.commonApplicationService.getLicenceTermsAndFees(
			workerLicenceTypeCode,
			applicationTypeCode,
			bizTypeCode,
			originalLicenceTermCode
		);
	}
}
