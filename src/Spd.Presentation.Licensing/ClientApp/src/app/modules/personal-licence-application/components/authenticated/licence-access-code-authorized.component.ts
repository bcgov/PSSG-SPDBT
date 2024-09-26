import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IActionResult } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
	selector: 'app-licence-access-code-authorized',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Link a Licence or Permit</h2>
						</div>

						<div class="col-xl-6 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								<button
									mat-stroked-button
									color="primary"
									class="large w-auto mb-3"
									aria-label="Back"
									(click)="onBack()"
								>
									<mat-icon>arrow_back</mat-icon>Back
								</button>
							</div>
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<app-alert type="info" icon="">
						<p>
							If you have an valid or expired security worker licence, body armour permit, or armoured vehicle permit,
							link your existing account with your unique access code.
						</p>
						<p>
							You need both your licence number as it appears on your current or expired licence, plus the access code
							number. You can find your access code on the letter that came with your new licence, or your licence
							renewal letter.
						</p>
						<p>
							If you do not know your access code, you may call Security Program's Licensing Unit during regular office
							hours and answer identifying questions to get your access code: {{ spdPhoneNumber }}.
						</p>
					</app-alert>

					<form [formGroup]="form" novalidate>
						<div class="row mt-4">
							<div class="col-xxl-4 col-xl-4 col-lg-5 col-md-12">
								<mat-form-field>
									<mat-label>Current or Expired Licence Number</mat-label>
									<input
										matInput
										formControlName="licenceNumber"
										oninput="this.value = this.value.toUpperCase()"
										[errorStateMatcher]="matcher"
										maxlength="10"
									/>
									<mat-error *ngIf="form.get('licenceNumber')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-3 col-xl-4 col-lg-3 col-md-12">
								<mat-form-field>
									<mat-label>Access Code</mat-label>
									<input
										matInput
										formControlName="accessCode"
										oninput="this.value = this.value.toUpperCase()"
										[errorStateMatcher]="matcher"
										maxlength="10"
									/>
									<mat-error *ngIf="form.get('accessCode')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-3 col-xl-3 col-lg-4 col-md-12">
								<button mat-flat-button color="primary" class="large mt-2" (click)="onLink()">
									<mat-icon>link</mat-icon>Link to your Account
								</button>
							</div>
							<div class="col-12" *ngIf="isLinkErrorMessage">
								<app-alert type="danger" icon="error">
									{{ isLinkErrorMessage }}
								</app-alert>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LicenceAccessCodeAuthorizedComponent implements OnInit, LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	isLinkErrorMessage: string | null = null;

	form: FormGroup = this.workerApplicationService.linkAccountCodeFormGroup;

	licenceNumberParam: string | null = null;

	constructor(
		private router: Router,
		private hotToastService: HotToastService,
		private workerApplicationService: WorkerApplicationService
	) {
		// check if a licenceNumber was passed from 'WorkerLicenceFirstTimeUserSelectionComponent'
		const state = this.router.getCurrentNavigation()?.extras.state;
		this.licenceNumberParam = state && state['licenceNumber'] ? state['licenceNumber'] : null;
		if (this.licenceNumberParam) {
			this.form.patchValue({ licenceNumber: this.licenceNumberParam });
		}
	}

	ngOnInit(): void {
		this.isLinkErrorMessage = null;
		this.form.reset();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onLink(): void {
		this.isLinkErrorMessage = null;

		if (!this.isFormValid()) return;

		this.workerApplicationService.linkLicenceOrPermit(this.licenceNumber.value, this.accessCode.value).subscribe({
			next: (_resp: StrictHttpResponse<IActionResult>) => {
				if (_resp.status != 200) {
					this.isLinkErrorMessage = 'This licence number and access code are not a valid combination.';
					return;
				}

				this.hotToastService.success('The licence or permit has been successfully linked to your account');
				this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathUserApplications());
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
				this.isLinkErrorMessage = `An error during the linking process. Please call the Security Program's Licensing Unit during regular office hours: ${this.spdPhoneNumber}.`;
			},
		});
	}

	onBack(): void {
		this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathUserApplications());
	}

	get licenceNumber(): FormControl {
		return this.form.get('licenceNumber') as FormControl;
	}
	get accessCode(): FormControl {
		return this.form.get('accessCode') as FormControl;
	}
}
