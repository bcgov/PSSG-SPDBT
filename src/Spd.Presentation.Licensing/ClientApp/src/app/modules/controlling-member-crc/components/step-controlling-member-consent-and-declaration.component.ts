import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-controlling-member-consent-and-declaration',
	template: `
		<app-step-section title="Consent and Declaration">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-9 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="conditions px-3 mb-3">
								<div class="my-3">
									<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
										As an individual who controls or is able to control the security business applicant (Controlling
										Member), I hereby consent to the Registrar of Security Services (Registrar) carrying out a criminal
										record check, police information check and correctional service information check (Prescribed
										Checks) on me pursuant to the <i>Security Services Review Act (SSA)</i>.
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
										I hereby consent to a check of available law enforcement systems for these purposes, including any
										local police records, and I hereby consent to the disclosure to the Registrar of any documents in
										the custody of the police, corrections, the courts, and crown counsel relating to these Prescribed
										Checks.
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
										For a first application in my capacity as Controlling Member, I understand that the SSA requires
										that I submit my fingerprints to the Registrar. My fingerprints will be used to verify my identity
										for the purposes of Prescribed Checks. Once my fingerprints results are on file with the Registrar,
										I will not need to re-submit them to verify my identity. However, I understand that fingerprinting
										may be required as an authentication method if I choose not to use my BC Services Card or other
										approved government-issued ID to access the Electronic Security Services Portal.
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
										I agree that I will notify the Registrar of any new charge or conviction against me, of any change
										in my residential address, legal name or peace officer status, or if I begin treatment for a mental
										health condition.
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
										In my capacity as Controlling Member, I agree that I must abide by the <i>Code of Conduct</i> set
										out at section 14 of the <i>Security Services Regulation</i>.
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

								<div class="my-3">
									This consent is valid from the date signed and will remain in effect for the duration of the period
									for which the security business licence issued is valid.
								</div>
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

						<app-collection-notice></app-collection-notice>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepControllingMemberConsentAndDeclarationComponent implements OnInit, LicenceChildStepperStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.controllingMembersService.consentAndDeclarationFormGroup;

	constructor(
		private utilService: UtilService,
		private authProcessService: AuthProcessService,
		private controllingMembersService: ControllingMemberCrcService
	) {}

	ngOnInit(): void {
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
		if (data.check1 && data.check2 && data.check3 && data.check4 && data.check5) {
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
