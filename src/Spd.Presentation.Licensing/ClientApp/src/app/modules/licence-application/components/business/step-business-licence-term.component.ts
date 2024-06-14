import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, BizTypeCode, LicenceFeeResponse, WorkerLicenceTypeCode } from '@app/api/models';
import { BusinessApplicationService } from '../../services/business-application.service';
import { CommonApplicationService } from '../../services/common-application.service';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-term',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container *ngIf="applicationTypeCode === applicationTypeRenewal">
					<app-common-update-renewal-alert
						[workerLicenceTypeCode]="securityBusinessLicenceCode"
					></app-common-update-renewal-alert>
				</ng-container>

				<app-step-title
					title="Select your licence term"
					subtitle="The licence term will apply to all licence categories"
				></app-step-title>

				<div class="row" *ngIf="infoText">
					<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12 mx-auto">
						<app-alert type="info" icon="info">
							{{ infoText }}
						</app-alert>
					</div>
				</div>

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
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceTermComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.businessApplicationService.licenceTermFormGroup;
	securityBusinessLicenceCode = WorkerLicenceTypeCode.SecurityBusinessLicence;

	applicationTypeRenewal = ApplicationTypeCode.Renewal;

	@Input() isBusinessLicenceSoleProprietor!: boolean;

	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() bizTypeCode!: BizTypeCode;

	constructor(
		private businessApplicationService: BusinessApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get termCodes(): Array<LicenceFeeResponse> {
		if (!this.workerLicenceTypeCode || !this.applicationTypeCode || !this.bizTypeCode) {
			return [];
		}

		return this.commonApplicationService.getLicenceTermsAndFees(
			this.workerLicenceTypeCode,
			this.applicationTypeCode,
			this.bizTypeCode
		);
	}

	get infoText(): string {
		return this.isBusinessLicenceSoleProprietor
			? 'If you select a term that is longer than your security worker licence, we will automatically extend your worker licence to match the expiry date of this business licence. You will then be able to renew them together in the future.'
			: '';
	}
}
