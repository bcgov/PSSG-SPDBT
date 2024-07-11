import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { CaptchaResponse } from '../../captcha-v2.component';
import { AppInviteOrgData, CrcFormStepComponent } from '../screening-application.model';

@Component({
	selector: 'app-sa-consent-to-crc',
	template: `
		<section class="step-section p-3" *ngIf="orgData">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title title="Consent to share a Criminal Record Check" [subtitle]="certifyLabel"></app-step-title>
					<div class="row">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
							<div class="conditions p-3 mb-3">
								<mat-checkbox formControlName="consentToShareResultCrc">
									As an applicant having undergone a previous criminal record check under the
									<i>Criminal Records Review Act</i> (CRRA), I hereby request to share the results of my criminal record
									check with the organization I am now applying to. I understand that to share the result of a criminal
									record check, I must have completed a criminal record check within the last 5 (five) years through the
									Criminal Records Review Programs (CRRP). I also understand that the sharing request must be for the
									same type of check as previously completed, either for children, vulnerable adults, or both children
									and vulnerable adults.
								</mat-checkbox>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('consentToShareResultCrc')?.dirty || form.get('consentToShareResultCrc')?.touched) &&
										form.get('consentToShareResultCrc')?.invalid &&
										form.get('consentToShareResultCrc')?.hasError('required')
									"
									>This is required</mat-error
								>
								<mat-checkbox formControlName="consentToCompletedCrc">
									I confirm I have completed a criminal record check within the past 5 (five) years with the CRRP which
									did not result in a determination of risk to children and/or vulnerable adults as defined in the CRRA.
									I understand that my sharing request is for an organization enrolled or registered with the CRRP, and
									that no details will be disclosed to the organization I am applying to, only the result. I hereby
									consent to share the result of the completed check with the organization I am applying to.
								</mat-checkbox>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('consentToCompletedCrc')?.dirty || form.get('consentToCompletedCrc')?.touched) &&
										form.get('consentToCompletedCrc')?.invalid &&
										form.get('consentToCompletedCrc')?.hasError('required')
									"
									>This is required</mat-error
								>
								<mat-checkbox formControlName="consentToNotifyNoCrc">
									I understand that if the Registrar determines I do not have a criminal record check to share according
									to the above criteria, I will be promptly notified. I also understand that even if I have a criminal
									record check to share according to the above criteria, the organization I am applying to is under no
									obligation to accept my sharing request and may require that I undergo a new criminal record check
									under the CRRA.
								</mat-checkbox>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('consentToNotifyNoCrc')?.dirty || form.get('consentToNotifyNoCrc')?.touched) &&
										form.get('consentToNotifyNoCrc')?.invalid &&
										form.get('consentToNotifyNoCrc')?.hasError('required')
									"
									>This is required</mat-error
								>
								<mat-checkbox formControlName="consentToNotifyRisk">
									I understand that within 5 (five) years of the date of my providing this Consent to Share a Criminal
									Record Check, should the Deputy Registrar make a determination that I pose a risk to children and/or
									vulnerable adults, the Deputy Registrar will promptly provide notification to me and to the persons
									and entities (organizations) identified in this Consent to Share a Criminal Record Check request
									process.
								</mat-checkbox>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('consentToNotifyRisk')?.dirty || form.get('consentToNotifyRisk')?.touched) &&
										form.get('consentToNotifyRisk')?.invalid &&
										form.get('consentToNotifyRisk')?.hasError('required')
									"
									>This is required</mat-error
								>
								<strong> Collection Notice </strong>
								<p>
									The Security Programs Division (SPD) will collect your personal information for the purpose of
									fulfilling the criminal record check requirements of the <i>Criminal Records Review Act</i> and in
									accordance with section 26(c) and 27(1)(a)(i) and (b) of the
									<i>Freedom of Information and Protection of Privacy Act</i> (FoIPPA). Additionally, SPD may collect
									personal information under section 26(e) and 27(1)(a)(i) and (b) of FoIPPA for the purpose of
									evaluating the Criminal Records Review Program and activities to better serve you. Should you have any
									questions about the collection, use, or disclosure of your personal information, please contact the
									Policy Analyst of the Criminal Records Review Program, Security Programs Division via mail to PO Box
									9217 Stn Prov Govt Victoria, BC V8W 9J1; email to
									<a href="mailto:criminalrecords@gov.bc.ca">criminalrecords&#64;gov.bc.ca</a>; or by telephone at 1-
									855-587-0185 (option 2).
								</p>
							</div>
						</div>
					</div>

					<div class="row mb-4" *ngIf="displayCaptcha">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
							<app-captcha-v2 (captchaResponse)="onTokenResponse($event)"></app-captcha-v2>
							<mat-error class="mat-option-error" *ngIf="displayValidationErrors && !captchaPassed">
								This is required
							</mat-error>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [
		`
			p {
				margin-bottom: 0.5rem !important;
			}

			.conditions {
				border: 1px solid var(--color-grey-light);
				box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
			}
		`,
	],
})
export class SaConsentToCrcComponent implements CrcFormStepComponent {
	matcher = new FormErrorStateMatcher();

	private _orgData!: AppInviteOrgData | null;
	@Input()
	set orgData(data: AppInviteOrgData | null) {
		if (!data) return;

		this._orgData = data;
		const name = this.utilService.getFullName(data.givenName, data.surname);
		this.certifyLabel = `I, ${name}, consent to the following:`;
	}
	get orgData(): AppInviteOrgData | null {
		return this._orgData;
	}

	displayValidationErrors = false;
	displayCaptcha = false;
	captchaPassed = false;
	captchaResponse: CaptchaResponse | null = null;

	booleanTypeCodes = BooleanTypeCode;
	certifyLabel = '';
	form: FormGroup = this.formBuilder.group({
		consentToShareResultCrc: new FormControl('', [Validators.requiredTrue]),
		consentToCompletedCrc: new FormControl('', [Validators.requiredTrue]),
		consentToNotifyNoCrc: new FormControl('', [Validators.requiredTrue]),
		consentToNotifyRisk: new FormControl('', [Validators.requiredTrue]),
	});

	constructor(
		private formBuilder: FormBuilder,
		private utilService: UtilService,
		private authProcessService: AuthProcessService
	) {}

	ngOnInit(): void {
		this.authProcessService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			this.displayCaptcha = !isLoggedIn;
		});
	}

	getDataToSave(): any {
		return {
			...this.form.value,
			recaptcha: this.displayCaptcha && this.captchaPassed ? this.captchaResponse?.resolved : null,
		};
	}

	isFormValid(): boolean {
		if (!this.form.valid) {
			this.utilService.scrollToCheckbox();
		}

		this.displayValidationErrors = !this.captchaPassed;
		return this.form.valid && ((this.displayCaptcha && this.captchaPassed) || !this.displayCaptcha);
	}

	onTokenResponse($event: CaptchaResponse) {
		this.captchaResponse = $event;
		this.captchaPassed = this.utilService.captchaTokenResponse($event);
	}
}
