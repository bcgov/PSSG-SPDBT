import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, BizTypeCode, LicenceFeeResponse, ServiceTypeCode } from '@app/api/models';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-step-worker-licence-term',
	template: `
		<app-step-section
			heading="Select your licence term"
			subheading="The licence term will apply to all licence categories"
			[isRenewalOrUpdate]="applicationTypeCode === applicationTypeCodes.Renewal"
			[serviceTypeCode]="securityWorkerLicenceCode"
		>
			<div class="row">
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<mat-radio-group aria-label="Select an option" formControlName="licenceTermCode">
							@for (term of termCodes; track term; let i = $index; let last = $last) {
								<mat-radio-button class="radio-label" [value]="term.licenceTermCode">
									{{ term.licenceTermCode | options: 'LicenceTermTypes' }} ({{
										term.amount | currency: 'CAD' : 'symbol-narrow' : '1.0'
									}})
								</mat-radio-button>
								@if (!last) {
									<mat-divider class="my-2"></mat-divider>
								}
							}
						</mat-radio-group>
						@if (
							(form.get('licenceTermCode')?.dirty || form.get('licenceTermCode')?.touched) &&
							form.get('licenceTermCode')?.invalid &&
							form.get('licenceTermCode')?.hasError('required')
						) {
							<mat-error class="mat-option-error">This is required</mat-error>
						}
					</form>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepWorkerLicenceTermComponent implements LicenceChildStepperStepComponent {
	securityWorkerLicenceCode = ServiceTypeCode.SecurityWorkerLicence;
	applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.workerApplicationService.licenceTermFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(
		private utilService: UtilService,
		private workerApplicationService: WorkerApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		const isValid = this.form.valid;

		if (isValid) {
			// Make sure the selected term is shown in the list
			// For example, user could select 'Electronic Locking Device Installer' then 1 Year term.
			// Then the user goes back and selects 'Security Guard - Under Supervision' instead.
			// This only has 90 days as an option, but the user previously selected 1 year.
			const licenceTermCode = this.form.get('licenceTermCode')?.value;
			const isFound = this.termCodes.findIndex((item: LicenceFeeResponse) => item.licenceTermCode === licenceTermCode);

			// Selected item is not valid
			if (isFound < 0) {
				this.form.patchValue({ licenceTermCode: null });
				return false;
			}
		}

		return isValid;
	}

	get termCodes(): Array<LicenceFeeResponse> {
		const serviceTypeCode = this.workerApplicationService.workerModelFormGroup.get(
			'serviceTypeData.serviceTypeCode'
		)?.value;

		const applicationTypeCode = this.workerApplicationService.workerModelFormGroup.get(
			'applicationTypeData.applicationTypeCode'
		)?.value;

		const isSoleProprietorYN = this.workerApplicationService.workerModelFormGroup.get(
			'soleProprietorData.isSoleProprietor'
		)?.value;

		const isSoleProprietor = this.utilService.booleanTypeToBoolean(isSoleProprietorYN);

		const bizTypeCode = isSoleProprietor
			? this.workerApplicationService.workerModelFormGroup.get('soleProprietorData.bizTypeCode')?.value
			: BizTypeCode.None;

		const categorySecurityGuardSupIsSelected = !!this.workerApplicationService.workerModelFormGroup.get(
			'categorySecurityGuardSupFormGroup.isInclude'
		)?.value;

		const originalLicenceTermCode = this.workerApplicationService.workerModelFormGroup.get(
			'originalLicenceData.originalLicenceTermCode'
		)?.value;

		return this.commonApplicationService.getLicenceTermsAndFees(
			serviceTypeCode,
			applicationTypeCode,
			bizTypeCode,
			originalLicenceTermCode,
			categorySecurityGuardSupIsSelected
		);
	}
}
