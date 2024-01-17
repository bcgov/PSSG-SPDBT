import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceFeeResponse } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-step-licence-term',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Renewal">
					<app-renewal-alert title="" subtitle="" [showLicenceData]="true"></app-renewal-alert>
				</ng-container>

				<app-step-title
					title="Select your licence term"
					subtitle="The licence term will apply to all licence categories"
				></app-step-title>

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
export class StepLicenceTermComponent implements LicenceChildStepperStepComponent {
	// termCodes: Array<LicenceFeeResponse> = [];
	applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.licenceApplicationService.licenceTermFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get termCodes(): Array<LicenceFeeResponse> {
		return this.licenceApplicationService.getLicenceTermsAndFees();
	}
}
