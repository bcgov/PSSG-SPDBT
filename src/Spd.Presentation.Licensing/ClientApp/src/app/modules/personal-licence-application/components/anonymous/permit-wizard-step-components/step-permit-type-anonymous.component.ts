import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, BizTypeCode, LicenceTermCode, ServiceTypeCode } from '@app/api/models';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { UtilService } from '@app/core/services/util.service';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';

@Component({
	selector: 'app-step-permit-type-anonymous',
	template: `
		<app-step-section heading="What type of permit are you applying for?">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<mat-radio-group aria-label="Select an option" formControlName="applicationTypeCode">
							<div class="row">
								<div class="col-xl-5 col-lg-4">
									<mat-radio-button class="radio-label" [value]="applicationTypeCodes.New"
										>New ({{ newCost | currency: 'CAD' : 'symbol-narrow' : '1.0' }} for a 5-year term)</mat-radio-button
									>
								</div>
								<div class="col-xl-7 col-lg-8">
									<app-alert type="info" icon="">
										Apply for a new permit if you've never held this type of permit, or if your existing permit has
										expired.
									</app-alert>
								</div>
							</div>
							<mat-divider class="mb-3"></mat-divider>
							<div class="row">
								<div class="col-xl-5 col-lg-4">
									<mat-radio-button class="radio-label" [value]="applicationTypeCodes.Renewal"
										>Renewal ({{ renewCost | currency: 'CAD' : 'symbol-narrow' : '1.0' }} for a 5-year
										term)</mat-radio-button
									>
								</div>
								<div class="col-xl-7 col-lg-8">
									<app-alert type="info" icon="">
										Renew your existing permit before it expires, within 90 days of the expiry date.
									</app-alert>
								</div>
							</div>
							<mat-divider class="mb-3"></mat-divider>
							<div class="row">
								<div class="col-xl-5 col-lg-4">
									<mat-radio-button class="radio-label" [value]="applicationTypeCodes.Update">
										Update (free)
									</mat-radio-button>
								</div>
								<div class="col-xl-7 col-lg-8">
									<app-alert type="info" icon="">
										Update contact details, report new criminal charges, and more. If your permit has been lost or
										stolen, please request an update.
									</app-alert>
								</div>
							</div>
						</mat-radio-group>
					</form>
					@if (
						(form.get('applicationTypeCode')?.dirty || form.get('applicationTypeCode')?.touched) &&
						form.get('applicationTypeCode')?.invalid &&
						form.get('applicationTypeCode')?.hasError('required')
					) {
						<mat-error class="mat-option-error">An option must be selected</mat-error>
					}
				</div>
			</div>
		</app-step-section>

		<app-wizard-footer (nextStepperStep)="onStepNext()"></app-wizard-footer>
	`,
	styles: [],
	standalone: false,
})
export class StepPermitTypeAnonymousComponent implements OnInit {
	applicationTypeCodes = ApplicationTypeCode;
	newCost: number | null = null;
	renewCost: number | null = null;

	form: FormGroup = this.permitApplicationService.applicationTypeFormGroup;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		const serviceTypeCode = this.permitApplicationService.permitModelFormGroup.get(
			'serviceTypeData.serviceTypeCode'
		)?.value;

		const newFee = this.commonApplicationService.getLicenceFee(
			serviceTypeCode,
			ApplicationTypeCode.New,
			BizTypeCode.None,
			LicenceTermCode.FiveYears
		);
		this.newCost = newFee ? (newFee.amount ?? null) : null;

		const renewFee = this.commonApplicationService.getLicenceFee(
			serviceTypeCode,
			ApplicationTypeCode.Renewal,
			BizTypeCode.None,
			LicenceTermCode.FiveYears
		);
		this.renewCost = renewFee ? (renewFee.amount ?? null) : null;

		this.commonApplicationService.setApplicationTitle(serviceTypeCode);
	}

	onStepNext(): void {
		const isValid = this.isFormValid();
		if (!isValid) {
			this.utilService.scrollToErrorSection();
			return;
		}

		const serviceTypeCode = this.permitApplicationService.permitModelFormGroup.get(
			'serviceTypeData.serviceTypeCode'
		)?.value;
		const applicationTypeCode = this.applicationTypeCode.value;

		// console.debug('serviceTypeCode', serviceTypeCode);
		// console.debug('applicationTypeCode', applicationTypeCode);

		this.commonApplicationService.setApplicationTitle(serviceTypeCode, applicationTypeCode);

		switch (serviceTypeCode) {
			case ServiceTypeCode.ArmouredVehiclePermit:
			case ServiceTypeCode.BodyArmourPermit: {
				switch (applicationTypeCode) {
					case ApplicationTypeCode.New: {
						this.router.navigateByUrl(
							PersonalLicenceApplicationRoutes.pathPermitAnonymous(
								PersonalLicenceApplicationRoutes.PERMIT_NEW_ANONYMOUS
							)
						);
						break;
					}
					case ApplicationTypeCode.Update:
					case ApplicationTypeCode.Renewal: {
						this.router.navigateByUrl(
							PersonalLicenceApplicationRoutes.pathPermitAnonymous(
								PersonalLicenceApplicationRoutes.PERMIT_ACCESS_CODE_ANONYMOUS
							)
						);
						break;
					}
				}
				break;
			}
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get applicationTypeCode(): FormControl {
		return this.form.get('applicationTypeCode') as FormControl;
	}
}
