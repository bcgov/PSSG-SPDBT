import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';

@Component({
	selector: 'app-gdsd-application-type-anonymous',
	template: `
		<app-step-section title="What type of Dog Trainer Certification are you applying for?">
			<div class="row">
				<div class="col-xl-6 col-lg-8 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<mat-radio-group aria-label="Select an option" formControlName="applicationTypeCode">
							<div class="row">
								<div class="col-lg-4">
									<mat-radio-button class="radio-label" [value]="applicationTypeCodes.New">New</mat-radio-button>
								</div>
								<div class="col-lg-8">
									<app-alert type="info" icon="">
										Apply for a new certification if you've never held this type of certification, or if your exisiting
										certification has expired.
									</app-alert>
								</div>
							</div>
							<mat-divider class="mb-3"></mat-divider>
							<div class="row">
								<div class="col-lg-4">
									<mat-radio-button class="radio-label" [value]="applicationTypeCodes.Renewal"
										>Renewal</mat-radio-button
									>
								</div>
								<div class="col-lg-8">
									<app-alert type="info" icon="">
										Renew your existing certification before it expires, within 90 days of the expiry date.
									</app-alert>
								</div>
							</div>
							<mat-divider class="mb-3"></mat-divider>
							<div class="row">
								<div class="col-lg-4">
									<mat-radio-button class="radio-label" [value]="applicationTypeCodes.Replacement">
										Replacement
									</mat-radio-button>
								</div>
								<div class="col-lg-8">
									<app-alert type="info" icon="">
										Lost your certification? Request a replacement card and we'll send you one.
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
		</app-step-section>

		<app-wizard-footer (nextStepperStep)="onStepNext()"></app-wizard-footer>
	`,
	styles: [],
	standalone: false,
})
export class GdsdApplicationTypeAnonymousComponent implements OnInit {
	applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.gdsdApplicationService.applicationTypeFormGroup;

	constructor(
		private router: Router,
		private gdsdApplicationService: GdsdApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit() {
		// this.commonApplicationService.setApplicationTitle(ServiceTypeCode.SecurityWorkerLicence);
	}

	onStepNext(): void {
		if (this.isFormValid()) {
			const applicationTypeCode = this.applicationTypeCode.value;

			// this.commonApplicationService.setApplicationTitle(ServiceTypeCode.SecurityWorkerLicence, applicationTypeCode);

			// switch (applicationTypeCode) {
			// 	case ApplicationTypeCode.New: {
			// 		this.router.navigateByUrl(
			// 			PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
			// 				PersonalLicenceApplicationRoutes.WORKER_LICENCE_NEW_ANONYMOUS
			// 			)
			// 		);
			// 		break;
			// 	}
			// 	case ApplicationTypeCode.Update:
			// 	case ApplicationTypeCode.Replacement:
			// 	case ApplicationTypeCode.Renewal: {
			// 		this.router.navigateByUrl(
			// 			PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
			// 				PersonalLicenceApplicationRoutes.LICENCE_ACCESS_CODE_ANONYMOUS
			// 			)
			// 		);
			// 		break;
			// 	}
			// }
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
