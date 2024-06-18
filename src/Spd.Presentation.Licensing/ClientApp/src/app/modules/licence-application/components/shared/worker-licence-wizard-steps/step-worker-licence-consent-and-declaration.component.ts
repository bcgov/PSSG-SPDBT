import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { UtilService } from '@app/core/services/util.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-step-worker-licence-consent-and-declaration',
	template: `
		<section class="step-section">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title title="Consent and Declaration"></app-step-title>

					<div class="row">
						<div class="col-xxl-9 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
							<div class="row">
								<div class="conditions px-3 mb-3">
									<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Update; else newOrRenewal">
										<div class="my-3">
											<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
												I hereby consent to my licence information (i.e. full name, licence number and licence status)
												being available for viewing online.
											</mat-checkbox>
											<mat-error
												class="mat-option-error"
												*ngIf="
													(form.get('check1')?.dirty || form.get('check1')?.touched) &&
													form.get('check1')?.invalid &&
													form.get('check1')?.hasError('required')
												"
												>This is required
											</mat-error>
										</div>
										<div class="my-3">
											<mat-checkbox formControlName="check2" (click)="onCheckboxChange()">
												If my fingerprints results are already on file with the Registrar, I will not need to re-submit
												them to verify my identity. However, I understand that fingerprinting may be required as an
												authentication method if I choose not to use my BC Services Card or other approved
												government-issued ID to access the Electronic Security Services Portal.
											</mat-checkbox>
											<mat-error
												class="mat-option-error"
												*ngIf="
													(form.get('check2')?.dirty || form.get('check2')?.touched) &&
													form.get('check2')?.invalid &&
													form.get('check2')?.hasError('required')
												"
												>This is required
											</mat-error>
										</div>
									</ng-container>

									<ng-template #newOrRenewal>
										<div class="my-3">
											<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
												I hereby consent to the Registrar of Security Services (Registrar) carrying out a criminal
												record check, police information check and correctional service information check (Prescribed
												Checks) on me pursuant to the Security Services Review Act (SSA).
											</mat-checkbox>
											<mat-error
												class="mat-option-error"
												*ngIf="
													(form.get('check1')?.dirty || form.get('check1')?.touched) &&
													form.get('check1')?.invalid &&
													form.get('check1')?.hasError('required')
												"
												>This is required
											</mat-error>
										</div>
										<div class="my-3">
											<mat-checkbox formControlName="check2" (click)="onCheckboxChange()">
												I hereby consent to a check of available law enforcement systems for these purposes, including
												any local police records, and I hereby consent to the disclosure to the Registrar of any
												documents in the custody of the police, corrections, the courts, and crown counsel relating to
												these Prescribed Checks.
											</mat-checkbox>
											<mat-error
												class="mat-option-error"
												*ngIf="
													(form.get('check2')?.dirty || form.get('check2')?.touched) &&
													form.get('check2')?.invalid &&
													form.get('check2')?.hasError('required')
												"
												>This is required
											</mat-error>
										</div>
										<div class="my-3">
											<mat-checkbox formControlName="check3" (click)="onCheckboxChange()">
												As a first-time applicant, I understand that the SSA requires that I submit my fingerprints to
												the Registrar. My fingerprints will be used to verify my identity for the purposes of Prescribed
												Checks and, as an alternative to my BC Services Card or other approved government-issued ID, may
												also be used as an authentication method to apply for a security licence via the Electronic
												Security Services Portal.
											</mat-checkbox>
											<mat-error
												class="mat-option-error"
												*ngIf="
													(form.get('check3')?.dirty || form.get('check3')?.touched) &&
													form.get('check3')?.invalid &&
													form.get('check3')?.hasError('required')
												"
												>This is required
											</mat-error>
										</div>
										<div class="my-3">
											<mat-checkbox formControlName="check4" (click)="onCheckboxChange()">
												For greater certainty, if I am not a first-time licence applicant, I will not need to re-submit
												my fingerprints to the Registrar to verify my identity. However, upon renewal of my security
												licence application on the Electronic Security Services Portal, if I choose not to use my BC
												Services Card or other approved government-issued ID as an authentication method, I understand
												that I may still be required to submit my fingerprints for the specific purpose of
												authenticating my access to the Portal.
											</mat-checkbox>
											<mat-error
												class="mat-option-error"
												*ngIf="
													(form.get('check4')?.dirty || form.get('check4')?.touched) &&
													form.get('check4')?.invalid &&
													form.get('check4')?.hasError('required')
												"
												>This is required
											</mat-error>
										</div>
										<div class="my-3">
											<mat-checkbox formControlName="check5" (click)="onCheckboxChange()">
												I hereby consent to my licence information (i.e. full name, licence number and licence status)
												being available for viewing online.
											</mat-checkbox>
											<mat-error
												class="mat-option-error"
												*ngIf="
													(form.get('check5')?.dirty || form.get('check5')?.touched) &&
													form.get('check5')?.invalid &&
													form.get('check5')?.hasError('required')
												"
												>This is required
											</mat-error>
										</div>
									</ng-template>

									<div class="my-3">
										This consent is valid from the date signed and will remain in effect for the duration of the period
										for which the licence issued is valid.
									</div>
								</div>
							</div>

							<div class="row">
								<div class="col-12">
									<mat-checkbox formControlName="agreeToCompleteAndAccurate" (click)="onCheckboxChange()">
										<ng-container
											*ngIf="applicationTypeCode === applicationTypeCodes.Update; else newOrRenewalCertifyText"
										>
											I HEREBY CERTIFY THAT I have read and understand all portions of this update form and the
											information set out by me in this application is true and correct to the best of my knowledge and
											belief. I have read and understand the <i>Security Services Act</i> and Regulations; and I am
											aware of, and understand, the conditions that will be placed on me as a licensee.
										</ng-container>

										<ng-template #newOrRenewalCertifyText>
											I HEREBY CERTIFY THAT I have read and understand all portions of this application form and the
											information set out by me in this application is true and correct to the best of my knowledge and
											belief. I have read and understand the <i>Security Services Act</i> and Regulations; and I am
											aware of, and understand, the conditions that will be placed on me as a licensee.
										</ng-template>
									</mat-checkbox>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(form.get('agreeToCompleteAndAccurate')?.dirty ||
												form.get('agreeToCompleteAndAccurate')?.touched) &&
											form.get('agreeToCompleteAndAccurate')?.invalid &&
											form.get('agreeToCompleteAndAccurate')?.hasError('required')
										"
										>This is required
									</mat-error>
								</div>
							</div>

							<div class="row mt-4">
								<div class="col-12">
									<mat-form-field class="w-auto">
										<mat-label>Date Signed</mat-label>
										<input matInput formControlName="dateSigned" />
										<mat-error *ngIf="form.get('dateSigned')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>
							</div>

							<div class="row mb-4" *ngIf="displayCaptcha.value">
								<div class="col-12">
									<div formGroupName="captchaFormGroup">
										<app-captcha-v2 [captchaFormGroup]="captchaFormGroup"></app-captcha-v2>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(captchaFormGroup.get('token')?.dirty || captchaFormGroup.get('token')?.touched) &&
												captchaFormGroup.get('token')?.invalid &&
												captchaFormGroup.get('token')?.hasError('required')
											"
											>This is required
										</mat-error>
									</div>
								</div>
							</div>

							<div class="row">
								<div class="col-12">
									<app-collection-notice></app-collection-notice>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceConsentAndDeclarationComponent implements OnInit, LicenceChildStepperStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.licenceApplicationService.consentAndDeclarationFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(
		private utilService: UtilService,
		private authProcessService: AuthProcessService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			// these checkboxes are not displayed in the update process
			this.form.patchValue({
				check3: true,
				check4: true,
				check5: true,
			});
		}

		this.authProcessService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			this.captchaFormGroup.patchValue({ displayCaptcha: !isLoggedIn });
		});
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onCheckboxChange(): void {
		const data = this.form.value;
		if (data.agreeToCompleteAndAccurate && data.check1 && data.check2 && data.check3 && data.check4 && data.check5) {
			this.form.controls['dateSigned'].setValue(this.utilService.getDateString(new Date()));
		} else {
			this.form.controls['dateSigned'].setValue('');
		}
	}

	get captchaFormGroup(): FormGroup {
		return this.form.get('captchaFormGroup') as FormGroup;
	}
	get displayCaptcha(): FormControl {
		return this.form.get('captchaFormGroup')?.get('displayCaptcha') as FormControl;
	}
}
