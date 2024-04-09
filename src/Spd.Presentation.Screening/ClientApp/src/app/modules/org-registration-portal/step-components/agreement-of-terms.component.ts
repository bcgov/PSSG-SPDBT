import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { CaptchaResponse, CaptchaResponseType } from 'src/app/shared/components/captcha-v2.component';
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
								<strong>TERMS AND CONDITIONS FOR EMPLOYERS THAT ENROL IN THE CRRP ONLINE SERVICE</strong><br /><br />
								<ul>
									<li>
										Upon completion of the Authorized Contact Consent To A Criminal Record Check Form, the CRRP will
										confirm enrollment of your organization in writing. If you have requested to enroll in the online
										service, your organization will be provided a unique link and access code. The access code must be
										provided to employees from an authorized contact.
									</li>
									<li>
										If your organization has volunteers covered under the Criminal Records Review Act and employees, you
										must enroll two separate profiles for the online service, one for “volunteers” and one for
										“employees”.
									</li>
									<li>
										If you enroll to conduct checks and sharing requests for volunteers, you must not utilize your
										unique link to the online service for employees and vice versa, if you enroll to conduct checks and
										sharing requests for employees, you must not utilize your unique link to the online service for
										volunteers.
									</li>
									<li>
										Upon confirmation of enrollment into the online service, your organization will direct employees as
										appropriate to the CRRP online service via the unique website link reserved for employees.
									</li>
									<li>
										The online service is offered to volunteers free of charge. For all other individuals, there is a
										$28 processing fee which may be paid by credit card within the online service when submitting a
										request for a criminal record check.
									</li>
									<li>
										There is no fee for a volunteer or employee to request to share a criminal record check result.
									</li>
									<li>
										Individuals may request to share their results between one or more organizations registered with the
										CRRP.
									</li>
									<li>
										If the online service electronic identity verification fails for any reason, or the criminal record
										check or sharing request cannot be completed online, the organization must re-confirm the ID of the
										applicant in person (see ID verification requirements) and submit the paper consent form by fax,
										email, or mail to the CRRP.
									</li>
									<li>
										Should the Authorized Contact leave the organization, have a new Authorized Contact complete the
										Organizations Account Information Update process.
									</li>
									<li>
										Misuse of the CRRP online service or disregard for the terms and conditions may result in suspension
										or cancellation of services.
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
								utilizing the CRRP to facilitate criminal record checks on our employees, contractors, or students
								(working with children and/or vulnerable adults), including the attached terms and conditions for
								enrolment in the CRRP online service, as applicable.
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
				max-height: 500px;
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

	constructor(private formBuilder: FormBuilder, private authProcessService: AuthProcessService) {}

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
		if ($event.type === CaptchaResponseType.success && this.captchaResponse?.resolved) {
			this.captchaPassed = true;
		} else {
			this.captchaPassed = false;
		}
	}
}
