import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-step-permit-consent-and-declaration',
	template: `
		<section class="step-section">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title title="Consent and Declaration"></app-step-title>
					<div class="row">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12 conditions px-3 mb-3">
							<ng-container *ngIf="isArmouredVehiclePermit; else bodyArmour">
								<div class="mt-2 fw-bold">I HEREBY AUTHORIZE:</div>
								<ul>
									<li>
										The Registrar, Security Services, to conduct a criminal record check through any city, municipal or
										provincial police department or public body including the police information check and correctional
										service information check, to determine whether I have a record for any provincial and/or federal
										charges, convictions, peace bonds or restraining orders, etc. This consent will remain in effect for
										the duration of the period for which my permit is valid.
									</li>
									<li>
										Where the results of this check indicated that a criminal record or outstanding charge may exist, I
										agree to provide my fingerprints to verify any such criminal record.
									</li>
									<li>
										I further authorize the RCMP, or designated authority, to provide a copy of my record to the
										Registrar, Security Services.
									</li>
								</ul>

								<div class="fw-bold">I UNDERSTAND THAT:</div>
								<div class="mb-3">
									As a result of the checks, the Registrar may require further information from me including copies of
									all criminal proceedings or information to assess good character and to assist in determining needs
									for operating an armoured vehicle.
								</div>

								<div class="fw-bold">I HEREBY CERTIFY THAT:</div>
								<div class="mb-3">
									I have read and understand all portions of this application form and the information set out by me in
									this application is true and correct to the best of my knowledge and belief. I have read and
									understand the Armoured Vehicle and After-Market Compartment Control Act and Regulations; and I am
									aware of and understand the conditions that will be placed on me as an operator of an armoured
									vehicle.
								</div>
							</ng-container>

							<ng-template #bodyArmour>
								<div class="mt-2 fw-bold">I HEREBY AUTHORIZE:</div>
								<ul>
									<li>
										The Registrar, Security Services, to conduct a criminal record check through any city, municipal or
										provincial police department or public body including the police information check and correctional
										service information check, to determine whether I have a record for any provincial and/or federal
										charges, convictions, peace bonds or restraining orders, etc. This consent will remain in effect for
										the duration of the period for which my permit is valid.
									</li>
									<li>
										Where the results of this check indicated that a criminal record or outstanding charge may exist, I
										agree to provide my fingerprints to verify any such criminal record.
									</li>
									<li>
										I further authorize the RCMP, or designated authority, to provide a copy of my record to the
										Registrar, Security Services.
									</li>
								</ul>

								<div class="fw-bold">I UNDERSTAND THAT:</div>
								<div class="mb-3">
									As a result of the checks, the Registrar may require further information from me including copies of
									all criminal proceedings or information to assess good character and to assist in determining needs
									for operating an Body Armour.
								</div>

								<div class="fw-bold">I HEREBY CERTIFY THAT:</div>
								<div class="mb-3">
									I have read and understand all portions of this application form and the information set out by me in
									this application is true and correct to the best of my knowledge and belief. I have read and
									understand the Body Armour and After-Market Compartment Control Act and Regulations; and I am aware of
									and understand the conditions that will be placed on me as an operator of an Body Armour.
								</div>
							</ng-template>
						</div>
					</div>

					<div class="row">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
							<mat-checkbox formControlName="agreeToCompleteAndAccurate" (click)="onCheckboxChange()">
								Declaration & Sign Off
							</mat-checkbox>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('agreeToCompleteAndAccurate')?.dirty || form.get('agreeToCompleteAndAccurate')?.touched) &&
									form.get('agreeToCompleteAndAccurate')?.invalid &&
									form.get('agreeToCompleteAndAccurate')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>

					<div class="row mt-4">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
							<mat-form-field class="w-auto">
								<mat-label>Date Signed</mat-label>
								<input matInput formControlName="dateSigned" />
								<mat-error *ngIf="form.get('dateSigned')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
					</div>

					<div class="row mb-4" *ngIf="displayCaptcha.value">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<div formGroupName="captchaFormGroup">
								<app-captcha-v2 [captchaFormGroup]="captchaFormGroup"></app-captcha-v2>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(captchaFormGroup.get('token')?.dirty || captchaFormGroup.get('token')?.touched) &&
										captchaFormGroup.get('token')?.invalid &&
										captchaFormGroup.get('token')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>
					</div>

					<div class="row mt-4">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<app-alert type="info" icon="" [showBorder]="false">
								<div class="mb-2">COLLECTION NOTICE</div>
								All information regarding this application is collected under the
								<i>{{ collectionNoticeActName }}</i> and its Regulation and will be used for that purpose. The use of
								this information will comply with the <i>Freedom of Information</i> and <i>Privacy Act</i> and the
								federal <i>Privacy Act</i>. If you have any questions regarding the collection or use of this
								information, please contact
								<a href="mailto:securitylicensing@gov.bc.ca">securitylicensing&#64;gov.bc.ca</a>
							</app-alert>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [],
})
export class StepPermitConsentAndDeclarationComponent implements OnInit, LicenceChildStepperStepComponent {
	collectionNoticeActName = '';
	form: FormGroup = this.permitApplicationService.consentAndDeclarationFormGroup;

	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;

	constructor(
		private utilService: UtilService,
		private authProcessService: AuthProcessService,
		private permitApplicationService: PermitApplicationService
	) {}

	ngOnInit(): void {
		if (this.isArmouredVehiclePermit) {
			this.collectionNoticeActName = 'Armoured Vehicle and After Market Compartment Control Act';
		} else {
			this.collectionNoticeActName = 'Body Armour Control Act';
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
		return this.workerLicenceTypeCode === WorkerLicenceTypeCode.ArmouredVehiclePermit;
	}
}
