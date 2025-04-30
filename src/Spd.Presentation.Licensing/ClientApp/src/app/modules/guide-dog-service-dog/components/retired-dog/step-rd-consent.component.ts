import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-rd-consent',
	template: `
		<app-step-section title="Consent and Declaration">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-9 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-12 py-3 hereby">
								<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
									I certify that the information I have provided above is, to the best of my knowledge, true and
									complete. I understand that inaccurate, misleading, missing or false information may lead to denial or
									cancellation of my guide or service dog certificate. I agree to adhere to any terms and conditions of
									certification. I agree to the release of the information above to the Justice Institute for the
									purposes of the BC Guide dog and service dog assessment.
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
						</div>

						<div class="col-xl-6 col-lg-6 col-md-12 mt-4">
							<mat-form-field>
								<mat-label>Name of Applicant or Legal Guardian</mat-label>
								<input
									matInput
									formControlName="applicantOrLegalGuardianName"
									maxlength="80"
									[errorStateMatcher]="matcher"
								/>
								<mat-error *ngIf="form.get('applicantOrLegalGuardianName')?.hasError('required')">
									This is required
								</mat-error>
							</mat-form-field>
						</div>

						<div class="row">
							<div class="col-12 mt-3">
								<mat-checkbox formControlName="agreeToCompleteAndAccurate" (click)="onCheckboxChange()">
									Declaration & Sign Off
								</mat-checkbox>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('agreeToCompleteAndAccurate')?.dirty ||
											form.get('agreeToCompleteAndAccurate')?.touched) &&
										form.get('agreeToCompleteAndAccurate')?.invalid &&
										form.get('agreeToCompleteAndAccurate')?.hasError('required')
									"
								>
									This is required
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

						<app-alert type="success" icon="">
							<div class="mb-2">COLLECTION NOTICE</div>
							<p>
								All information regarding this application is collected under s. 26(a) and (c) of the Freedom of
								Information and Protection of Privacy Act as per the Guide Dog and Service Dog Act and its Regulation
								and will be used for the purpose of certifying guide and service dog teams in BC. If you have questions
								regarding the collection or use of this information, please contact a Policy Analyst at 1-855-587-0185
								or the address below:
							</p>

							<div>Ministry of Public Safety and Solicitor General</div>
							<div>Policing and Security Branch, Security Programs Division</div>
							<div>PO Box 9217 Stn Prov Govt, Victoria BC V8W 9J1</div>
							<div>Phone: toll-free 1-855-587-0185</div>
							<div>Fax: 250 387-4454</div>
							<div>
								Email:
								<a
									aria-label="Send email to guide dog service dogs"
									href="mailto:guideandservicedogs@gov.bc.ca "
									class="email-address-link"
									>guideandservicedogs&#64;gov.bc.ca</a
								>
							</div>
							<div>
								Website:
								<a href=" http://www2.gov.bc.ca/gov/content/justice/human-rights/guide-and-service-dog" target="_blank">
									Guide Dog Service Dog</a
								>
							</div>
						</app-alert>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [
		`
			.hereby {
				background-color: #f6f6f6 !important;
			}
		`,
	],
	standalone: false,
})
export class StepRdConsentComponent implements OnInit, LicenceChildStepperStepComponent {
	check1Name = '';
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.retiredDogApplicationService.consentAndDeclarationFormGroup;

	constructor(
		private utilService: UtilService,
		private authProcessService: AuthProcessService,
		private retiredDogApplicationService: RetiredDogApplicationService
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
}
