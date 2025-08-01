import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-permit-consent-and-declaration',
	template: `
		<app-step-section heading="Consent and Declaration">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-9 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							@if (applicationTypeCode !== applicationTypeCodes.Update) {
								<div class="conditions px-3 mb-3">
									<div class="my-3">
										<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
											I hereby consent to the Registrar of Security Services (Registrar) carrying out a criminal record
											check, police information check and correctional service information check (Prescribed Checks) on
											me pursuant to the <i>{{ collectionNoticeActNameWithAbbrev }}</i
											>.
										</mat-checkbox>
										@if (
											(form.get('check1')?.dirty || form.get('check1')?.touched) &&
											form.get('check1')?.invalid &&
											form.get('check1')?.hasError('required')
										) {
											<mat-error class="mat-option-error">This is required</mat-error>
										}
									</div>
									<div class="my-3">
										<mat-checkbox formControlName="check2" (click)="onCheckboxChange()">
											I hereby consent to a check of available law enforcement systems for these purposes, including any
											local police records, and I hereby consent to the disclosure to the Registrar of any documents in
											the custody of the police, corrections, the courts, and crown counsel relating to these Prescribed
											Checks.
										</mat-checkbox>
										@if (
											(form.get('check2')?.dirty || form.get('check2')?.touched) &&
											form.get('check2')?.invalid &&
											form.get('check2')?.hasError('required')
										) {
											<mat-error class="mat-option-error">This is required</mat-error>
										}
									</div>
									<div class="my-3">
										<mat-checkbox formControlName="check3" (click)="onCheckboxChange()">
											I understand that in addition to any information provided to the Registrar as a result of the
											Prescribed Checks, the Registrar may require from me any further information the Registrar
											considers relevant to assist in the demonstration of my need for {{ check3Name }}.
										</mat-checkbox>
										@if (
											(form.get('check3')?.dirty || form.get('check3')?.touched) &&
											form.get('check3')?.invalid &&
											form.get('check3')?.hasError('required')
										) {
											<mat-error class="mat-option-error">This is required</mat-error>
										}
									</div>
									<div class="my-3">
										This consent is valid from the date signed and will remain in effect for the duration of the period
										for which the permit issued is valid.
									</div>
								</div>
							}
						</div>

						<div class="row">
							<div class="col-12">
								<mat-checkbox formControlName="check4" (click)="onCheckboxChange()">
									@if (applicationTypeCode === applicationTypeCodes.Update) {
										I HEREBY CERTIFY THAT I have read and understand all portions of this update form and the
										information set out by me herein is true and correct to the best of my knowledge and belief. I have
										read and understand the <i>{{ collectionNoticeActName }}</i> and Regulations; and I confirm that I
										am aware of, understand, and remain bound by the conditions that are placed on me as
										{{ check4Name }}.
									} @else {
										I HEREBY CERTIFY THAT I have read and understand all portions of this application form and the
										information set out by me in this application is true and correct to the best of my knowledge and
										belief. I have read and understand the <i>{{ collectionNoticeActName }}</i> and Regulations; and I
										am aware of, and understand, the conditions that will be placed on me as {{ check4Name }}.
									}
								</mat-checkbox>
								@if (
									(form.get('check4')?.dirty || form.get('check4')?.touched) &&
									form.get('check4')?.invalid &&
									form.get('check4')?.hasError('required')
								) {
									<mat-error class="mat-option-error">This is required</mat-error>
								}
							</div>
						</div>

						<div class="row">
							<div class="col-12 mt-4">
								<mat-checkbox formControlName="agreeToCompleteAndAccurate" (click)="onCheckboxChange()">
									I certify that, to the best of my knowledge, the information I have provided and will provide as
									necessary is complete and accurate.
								</mat-checkbox>
								@if (
									(form.get('agreeToCompleteAndAccurate')?.dirty || form.get('agreeToCompleteAndAccurate')?.touched) &&
									form.get('agreeToCompleteAndAccurate')?.invalid &&
									form.get('agreeToCompleteAndAccurate')?.hasError('required')
								) {
									<mat-error class="mat-option-error"> This is required</mat-error>
								}
							</div>
						</div>

						<div class="row mt-4">
							<div class="col-12">
								<mat-form-field class="w-auto">
									<mat-label>Date Signed</mat-label>
									<input matInput formControlName="dateSigned" />
									@if (form.get('dateSigned')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
								</mat-form-field>
							</div>
						</div>

						@if (displayCaptcha.value) {
							<div class="row mb-4">
								<div class="col-12">
									<div formGroupName="captchaFormGroup">
										<app-captcha-v2 [captchaFormGroup]="captchaFormGroup"></app-captcha-v2>
										@if (
											(captchaFormGroup.get('token')?.dirty || captchaFormGroup.get('token')?.touched) &&
											captchaFormGroup.get('token')?.invalid &&
											captchaFormGroup.get('token')?.hasError('required')
										) {
											<mat-error class="mat-option-error">This is required</mat-error>
										}
									</div>
								</div>
							</div>
						}

						<app-collection-notice [collectionNoticeActName]="collectionNoticeActName"></app-collection-notice>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepPermitConsentAndDeclarationComponent implements OnInit, LicenceChildStepperStepComponent {
	collectionNoticeActName = '';
	collectionNoticeActNameWithAbbrev = '';
	check3Name = '';
	check4Name = '';

	form: FormGroup = this.permitApplicationService.consentAndDeclarationFormGroup;

	@Input() serviceTypeCode!: ServiceTypeCode;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	applicationTypeCodes = ApplicationTypeCode;

	constructor(
		private utilService: UtilService,
		private authProcessService: AuthProcessService,
		private permitApplicationService: PermitApplicationService
	) {}

	ngOnInit(): void {
		if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			// these checkboxes are not displayed in the update process
			this.form.patchValue({
				check1: true,
				check2: true,
				check3: true,
			});
		}

		if (this.isArmouredVehiclePermit) {
			this.collectionNoticeActName = 'Armoured Vehicle and After-Market Compartment Control Act';
			this.collectionNoticeActNameWithAbbrev = `${this.collectionNoticeActName} (AVAMCCA)`;
			this.check3Name = 'operating an armoured vehicle';
			this.check4Name = 'an armoured vehicle operator';
		} else {
			this.collectionNoticeActName = 'Body Armour Control Act';
			this.collectionNoticeActNameWithAbbrev = `${this.collectionNoticeActName} (BACA)`;
			this.check3Name = 'possessing body armour';
			this.check4Name = 'a body armour permit holder';
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
		if (data.agreeToCompleteAndAccurate) {
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
	get isArmouredVehiclePermit(): boolean {
		return this.serviceTypeCode === ServiceTypeCode.ArmouredVehiclePermit;
	}
}
