import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { take, tap } from 'rxjs';
import { MetalDealersAndRecyclersRoutes } from '../metal-dealers-and-recyclers-routes';

@Component({
	selector: 'app-step-mdra-application-type',
	template: `
		<app-step-section title="Registration information">
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xl-6 col-lg-8 col-md-12 col-sm-12 mx-auto">
								<form [formGroup]="form" novalidate>
									<mat-radio-group aria-label="Select an option" formControlName="applicationTypeCode">
										<div class="row">
											<div class="col-lg-4">
												<mat-radio-button class="radio-label" [value]="applicationTypeCodes.New">New</mat-radio-button>
											</div>
											<div class="col-lg-8">
												<app-alert type="info" icon=""> Apply for a new registration </app-alert>
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
													Renew your existing registration (within 90 days before it expires)
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
													If you’ve lost your registration, request a replacement card.
												</app-alert>
											</div>
										</div>
										<mat-divider class="mb-3"></mat-divider>
										<div class="row">
											<div class="col-lg-4">
												<mat-radio-button class="radio-label" [value]="applicationTypeCodes.Update"
													>Update</mat-radio-button
												>
											</div>
											<div class="col-lg-8">
												<app-alert type="info" icon=""> Update registration information </app-alert>
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
					</form>
				</div>
			</div>
		</app-step-section>

		<app-wizard-footer (nextStepperStep)="onStepNext()"></app-wizard-footer>
	`,
	styles: [],
	standalone: false,
})
export class StepMdraApplicationTypeComponent implements LicenceChildStepperStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	form = this.metalDealersApplicationService.registrationFormGroup;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private metalDealersApplicationService: MetalDealersApplicationService
	) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onStepNext(): void {
		if (!this.isFormValid()) {
			this.utilService.scrollToErrorSection();
			return;
		}

		const applicationTypeCode = this.applicationTypeCode.value;

		switch (applicationTypeCode) {
			case ApplicationTypeCode.New: {
				this.metalDealersApplicationService
					.createNewRegistration()
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(MetalDealersAndRecyclersRoutes.path(MetalDealersAndRecyclersRoutes.MDRA_NEW));
						}),
						take(1)
					)
					.subscribe();

				break;
			}
			case ApplicationTypeCode.Update:
			case ApplicationTypeCode.Renewal:
			case ApplicationTypeCode.Replacement: {
				this.router.navigateByUrl(MetalDealersAndRecyclersRoutes.path(MetalDealersAndRecyclersRoutes.MDRA_ACCESS_CODE));
				break;
			}
		}
	}

	get applicationTypeCode(): FormControl {
		return this.form.get('applicationTypeCode') as FormControl;
	}
}
