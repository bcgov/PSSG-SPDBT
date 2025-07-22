import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IActionResult, ServiceTypeCode } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-licence-access-code-link',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">{{ title }}</h2>
						</div>

						<div class="col-xl-6 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								<button
									mat-stroked-button
									color="primary"
									class="large w-auto mb-3"
									aria-label="Back to main page"
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
							{{ infoText }}
						</p>
						<p>
							You will need your licence number as it appears on your current or expired licence along with the unique
							access code number provided in the letter that came with your new or renewal licence.
						</p>
						<p>
							If you don’t have your access code, or are unable to locate it, please contact the Security Licencing Unit
							at {{ spdPhoneNumber }} during regular office hours.
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
									@if (form.get('licenceNumber')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
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
									@if (form.get('accessCode')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
								</mat-form-field>
							</div>
							<div class="col-xxl-3 col-xl-3 col-lg-4 col-md-12">
								<button
									mat-flat-button
									color="primary"
									class="large mt-2"
									aria-label="Link the selected licence to your account"
									(click)="onLink()"
								>
									<mat-icon>link</mat-icon>Link to your Account
								</button>
							</div>
							@if (isLinkErrorMessage) {
								<div class="col-12">
									<app-alert type="danger" icon="dangerous">
										{{ isLinkErrorMessage }}
									</app-alert>
								</div>
							}
						</div>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
	standalone: false,
})
export class LicenceAccessCodeLinkComponent implements OnInit, LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	title = 'Link a Licence or Permit';
	infoText =
		'If you have a valid or expired security worker licence, body armour permit, or armoured vehicle permit, you can link them to your existing account using your unique access code.';

	serviceTypeCode!: ServiceTypeCode;

	isLinkErrorMessage: string | null = null;

	readonly link_error_code_message = 'This licence number and access code are not a valid combination.';
	readonly link_error_fail_message = `An error during the linking process. Please call the Security Program's Licensing Unit during regular office hours: ${this.spdPhoneNumber}.`;

	form!: FormGroup;

	licenceNumberParam: string | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private utilService: UtilService,
		private businessApplicationService: BusinessApplicationService,
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
		this.route.data.subscribe((data) => {
			this.serviceTypeCode = data['serviceTypeCode'];

			if (this.isBusinessLicence) {
				this.form = this.businessApplicationService.linkAccountCodeFormGroup;

				this.title = 'Link a Licence';
				this.infoText =
					'If you have a valid or expired security business licence, you can link it to your existing account using your unique access code.';
			} else {
				this.form = this.workerApplicationService.linkAccountCodeFormGroup;
			}
		});

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

		if (this.isBusinessLicence) {
			this.businessApplicationService.linkLicence(this.licenceNumber.value, this.accessCode.value).subscribe({
				next: (_resp: StrictHttpResponse<IActionResult>) => {
					if (_resp.status != 200) {
						this.isLinkErrorMessage = this.link_error_code_message;
						return;
					}

					this.utilService.toasterSuccess('The licence has been successfully linked to your account');
					this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
					this.isLinkErrorMessage = this.link_error_fail_message;
				},
			});
		} else {
			this.workerApplicationService.linkLicenceOrPermit(this.licenceNumber.value, this.accessCode.value).subscribe({
				next: (_resp: StrictHttpResponse<IActionResult>) => {
					if (_resp.status != 200) {
						this.isLinkErrorMessage = this.link_error_code_message;
						return;
					}

					this.utilService.toasterSuccess('The licence or permit has been successfully linked to your account');
					this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathUserApplications());
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
					this.isLinkErrorMessage = this.link_error_fail_message;
				},
			});
		}
	}

	onBack(): void {
		if (this.isBusinessLicence) {
			this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
			return;
		}

		this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathUserApplications());
	}

	get licenceNumber(): FormControl {
		return this.form.get('licenceNumber') as FormControl;
	}
	get accessCode(): FormControl {
		return this.form.get('accessCode') as FormControl;
	}
	get isBusinessLicence(): boolean {
		return this.serviceTypeCode === ServiceTypeCode.SecurityBusinessLicence;
	}
}
