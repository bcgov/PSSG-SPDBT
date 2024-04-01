import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode, BusinessTypeCode, LicenceFeeResponse, WorkerLicenceTypeCode } from '@app/api/models';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

@Component({
	selector: 'app-step-permit-type-anonymous',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="What type of permit are you applying for?"></app-step-title>

				<div class="row">
					<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<mat-radio-group aria-label="Select an option" formControlName="applicationTypeCode">
								<div class="row">
									<div class="col-xl-5 col-lg-4">
										<mat-radio-button class="radio-label" [value]="applicationTypeCodes.New"
											>New ({{ newCost | currency : 'CAD' : 'symbol-narrow' : '1.0' }} for a 5-year
											term)</mat-radio-button
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
											>Renewal ({{ renewCost | currency : 'CAD' : 'symbol-narrow' : '1.0' }} for a 5-year
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
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('applicationTypeCode')?.dirty || form.get('applicationTypeCode')?.touched) &&
								form.get('applicationTypeCode')?.invalid &&
								form.get('applicationTypeCode')?.hasError('required')
							"
							>An option must be selected</mat-error
						>
					</div>
				</div>
			</div>
		</section>

		<div class="row outside-wizard-button-row">
			<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
				<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Cancel</button>
			</div>
			<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
				<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext()">Next</button>
			</div>
		</div>
	`,
	styles: [],
})
export class StepPermitTypeAnonymousComponent implements OnInit {
	applicationTypeCodes = ApplicationTypeCode;
	newCost: number | null = null;
	renewCost: number | null = null;

	form: FormGroup = this.permitApplicationService.applicationTypeFormGroup;

	constructor(
		private router: Router,
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		const workerLicenceTypeCode = this.permitApplicationService.permitModelFormGroup.get(
			'workerLicenceTypeData.workerLicenceTypeCode'
		)?.value;

		const fees = this.commonApplicationService.getLicenceTermsAndFees(
			workerLicenceTypeCode,
			null,
			BusinessTypeCode.None
		);

		fees?.forEach((item: LicenceFeeResponse) => {
			if (item.applicationTypeCode === ApplicationTypeCode.New) {
				this.newCost = item.amount ? item.amount : null;
			} else if (item.applicationTypeCode === ApplicationTypeCode.Renewal) {
				this.renewCost = item.amount ? item.amount : null;
			}
		});

		this.commonApplicationService.setApplicationTitle(workerLicenceTypeCode);
	}

	onStepPrevious(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LOGIN_SELECTION));
	}

	onStepNext(): void {
		if (!this.isFormValid()) {
			return;
		}

		const workerLicenceTypeCode = this.permitApplicationService.permitModelFormGroup.get(
			'workerLicenceTypeData.workerLicenceTypeCode'
		)?.value;
		const applicationTypeCode = this.applicationTypeCode.value;

		// console.debug('workerLicenceTypeCode', workerLicenceTypeCode);
		// console.debug('applicationTypeCode', applicationTypeCode);

		this.commonApplicationService.setApplicationTitle(workerLicenceTypeCode, applicationTypeCode);

		switch (workerLicenceTypeCode) {
			case WorkerLicenceTypeCode.ArmouredVehiclePermit:
			case WorkerLicenceTypeCode.BodyArmourPermit: {
				switch (applicationTypeCode) {
					case ApplicationTypeCode.New: {
						this.router.navigateByUrl(
							LicenceApplicationRoutes.pathPermitAnonymous(LicenceApplicationRoutes.PERMIT_NEW_ANONYMOUS)
						);
						break;
					}
					case ApplicationTypeCode.Update:
					case ApplicationTypeCode.Renewal: {
						this.router.navigateByUrl(
							LicenceApplicationRoutes.pathPermitAnonymous(LicenceApplicationRoutes.PERMIT_ACCESS_CODE_ANONYMOUS)
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
