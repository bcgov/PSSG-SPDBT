import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { UtilService } from 'src/app/core/services/util.service';
import { CaptchaResponse } from 'src/app/shared/components/captcha-v2.component';
import { RegistrationFormStepComponent } from '../org-registration.component';

export class AgreementOfTermsModel {
	agreeToTermsAndConditions = '';
	recaptcha: string | null = null;
}

@Component({
	selector: 'app-agreement-of-terms',
	template: `
		<section class="step-section p-4">
			<div class="step">
				<app-step-title title="Review and agree to the following terms of agreement"></app-step-title>
				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<div class="conditions px-3 pt-2 mb-3" (scroll)="onScrollTermsAndConditions($event)">
								<strong
									>TERMS AND CONDITIONS FOR ORGANIZATIONS THAT ENROL IN THE CRIMINAL RECORDS REVIEW PROGRAM
									(CRRP)</strong
								><br /><br />
								<ul>
									<li>
										Upon completion of the online organization registration form, the CRRP will confirm enrollment of
										your organization via email and will provide your organization with an orientation package. It is
										your organization’s responsibility to review the CRRP orientation package and to ensure that the
										CRRP’s process requirements are met, notably as regards the verification and subsequent confirmation
										of the identity of applicants who come through your organization.
									</li>
									<li>
										If your organization has both volunteers and employees covered under the
										<i>Criminal Records Review Act</i>, you must enroll two separate profiles with the CRRP, one for
										"<strong>volunteers</strong>" and one for “<strong>employees</strong>”.
									</li>
									<li>
										If you enroll to conduct checks for both volunteers and employees, you will be provided with two
										specific access codes: one for use by your <strong>employees</strong>, and a different access code
										for use by your <strong>volunteers</strong>. When using this submission method, your organization’s
										Authorized Contact must ensure that volunteers and employees are given the correct access code to
										complete their online criminal record check.
									</li>
									<li>
										Upon confirmation of enrollment into the CRRP, your organization’s Authorized Contact will direct
										employees and/or volunteers to the CRRP online criminal record check application using your
										organization online platform, or by providing the applicant your organization’s unique access
										code(s) and link(s) for employees or volunteers, as applicable.
									</li>
									<li>
										Criminal record checks completed for volunteers are free of charge. For all other applicants, there
										is a $28 processing fee which may be paid by credit card online. Your organization determines who is
										responsible for payment of the fee.
									</li>
									<li>
										There is no fee for a volunteer or employee to share the result of a previously conducted criminal
										record check that meets the CRRP’s sharing requirements. Please refer to the CRRP orientation
										package provided to your organization for additional information on the sharing of CRRP criminal
										record checks.
									</li>
									<li>
										Should the Authorized Contact leave your organization, please update the list of Authorized Contacts
										in the organization online platform or have a new Authorized Contact complete the “Organizations
										Account Information Update” process.
									</li>
									<li>
										Misuse of the CRRP online criminal record check service or of your organization online platform, or
										disregard for any of the Terms and Conditions, as defined below, may result in suspension or
										cancellation of any or all CRRP criminal record check services extended to your organization.
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div class="row" *ngIf="displayValidationErrors && !hasScrolledToBottom">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<div class="alert alert-warning" role="alert">Please scroll to the bottom</div>
						</div>
					</div>

					<div class="row mt-2">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-checkbox formControlName="agreeToTermsAndConditions">
								On behalf of the above noted organization, I hereby certify that I agree to the terms and conditions for
								utilizing the CRRP to facilitate criminal record checks on our employees, volunteers, contractors, or
								students (working with children and/or vulnerable adults), including specifically these terms and
								conditions for enrolment in the CRRP online service, as applicable (Terms and Conditions).
							</mat-checkbox>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('agreeToTermsAndConditions')?.dirty || form.get('agreeToTermsAndConditions')?.touched) &&
									form.get('agreeToTermsAndConditions')?.invalid &&
									form.get('agreeToTermsAndConditions')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>

					<div class="row mb-4" *ngIf="displayCaptcha">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<app-captcha-v2
								(captchaResponse)="onTokenResponse($event)"
								[resetControl]="resetRecaptcha"
							></app-captcha-v2>
							<mat-error class="mat-option-error" *ngIf="displayValidationErrors && !captchaPassed">
								This is required
							</mat-error>
						</div>
					</div>
				</form>
			</div>
		</section>
	`,
	styles: [
		`
			li:not(:last-child) {
				margin-bottom: 1em;
			}

			.conditions {
				border: 1px solid var(--color-grey-light);
				max-height: 400px;
				overflow-y: auto;
				box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
			}
		`,
	],
})
export class AgreementOfTermsComponent implements OnInit, RegistrationFormStepComponent {
	@Input() resetRecaptcha: Subject<void> = new Subject<void>();

	form!: FormGroup;
	hasScrolledToBottom = false;
	displayValidationErrors = false;

	displayCaptcha = false;
	captchaPassed = false;
	captchaResponse: CaptchaResponse | null = null;

	constructor(
		private formBuilder: FormBuilder,
		private utilService: UtilService,
		private authProcessService: AuthProcessService
	) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			agreeToTermsAndConditions: new FormControl('', [Validators.requiredTrue]),
		});

		this.authProcessService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			this.displayCaptcha = !isLoggedIn;
		});

		this.resetRecaptcha.subscribe(() => this.onResetRecaptcha());
	}

	getDataToSave(): AgreementOfTermsModel {
		return {
			...this.form.value,
			recaptcha: this.displayCaptcha && this.captchaPassed ? this.captchaResponse?.resolved : null,
		};
	}

	isFormValid(): boolean {
		this.displayValidationErrors = !this.hasScrolledToBottom || !this.captchaPassed;
		return this.form.valid &&
			this.hasScrolledToBottom &&
			((this.displayCaptcha && this.captchaPassed) || !this.displayCaptcha)
			? true
			: false;
	}

	clearCurrentData(): void {
		this.form.reset();
		this.captchaPassed = false;
		this.captchaResponse = null;
	}

	onResetRecaptcha(): void {
		this.captchaPassed = false;
		this.captchaResponse = null;
	}

	onScrollTermsAndConditions(e: any) {
		if (e.target.scrollHeight < e.target.scrollTop + e.target.offsetHeight) {
			this.hasScrolledToBottom = true;
		}
	}

	onTokenResponse($event: CaptchaResponse) {
		this.captchaResponse = $event;
		this.captchaPassed = this.utilService.captchaTokenResponse($event);
	}
}
