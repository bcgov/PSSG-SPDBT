import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CaptchaResponse, CaptchaResponseType } from 'src/app/shared/components/captcha-v2.component';
import { AppInviteOrgData, CrcFormStepComponent } from '../crc.component';

export class DeclarationModel {
	agreeToCompleteAndAccurate: string | null = null;
	shareCrc: string | null = null;
}

@Component({
	selector: 'app-declaration',
	template: `
		<section class="step-section p-3" *ngIf="orgData">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title title="Consent to a Criminal Record Check"></app-step-title>
					<div class="row">
						<div class="offset-lg-3 col-lg-6 col-md-12 col-sm-12">
							<p class="fs-5">Declaration</p>
							<mat-checkbox formControlName="agreeToCompleteAndAccurate">
								I certify that, to the best of my knowledge, the information I have provided and will provide as
								necessary is complete and accurate.
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
					<!-- <div class="row" *ngIf="orgData.validCrc">
						<div class="offset-lg-3 col-lg-6 col-md-12 col-sm-12">
							<mat-divider class="my-3"></mat-divider>
							<p class="fs-5">Share your existing criminal record check</p>
							<div>
								You have an existing valid criminal record check. Do you want to share the results of this criminal
								record check at no cost?
							</div>
							<mat-radio-group aria-label="Select an option" formControlName="shareCrc">
								<mat-radio-button [value]="booleanTypeCodes.Yes">
									Yes, share my existing criminal record check
								</mat-radio-button>
								<mat-radio-button [value]="booleanTypeCodes.No">
									No, I'll submit a new criminal record check
								</mat-radio-button>
							</mat-radio-group>
							<div>
								NOTE: An organization can decide whether or not they will accept a shared criminal record check result
								and may ask you to consent to a new criminal record check.
							</div>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('shareCrc')?.dirty || form.get('shareCrc')?.touched) &&
									form.get('shareCrc')?.invalid &&
									form.get('shareCrc')?.hasError('required')
								"
								>An option must be selected</mat-error
							>
						</div>
					</div> -->
				</div>
			</form>

			<div class="row mb-4" *ngIf="displayCaptcha">
				<div class="offset-lg-3 col-lg-9 col-md-12 col-sm-12">
					<app-captcha-v2 (captchaResponse)="onTokenResponse($event)"></app-captcha-v2>
					<mat-error class="mat-option-error" *ngIf="displayValidationErrors && !captchaPassed">
						This is required
					</mat-error>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class DeclarationComponent implements OnInit, CrcFormStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	form!: FormGroup;
	displayValidationErrors = false;

	displayCaptcha = false;
	captchaPassed = false;
	captchaResponse: CaptchaResponse | null = null;

	private _orgData: AppInviteOrgData | null = null;
	@Input()
	set orgData(data: AppInviteOrgData | null) {
		if (!data) return;

		this._orgData = data;
		this.form = this.formBuilder.group(
			{
				agreeToCompleteAndAccurate: new FormControl('', [Validators.required]),
				// shareCrc: new FormControl(''),
			}
			// {
			// 	validators: [FormGroupValidators.conditionalRequiredValidator('shareCrc', (form) => data.validCrc ?? false)],
			// }
		);
	}
	get orgData(): AppInviteOrgData | null {
		return this._orgData;
	}

	constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) {}

	ngOnInit(): void {
		this.authenticationService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			this.displayCaptcha = !isLoggedIn;
		});
	}

	getDataToSave(): DeclarationModel {
		return {
			...this.form.value,
			recaptcha: this.displayCaptcha && this.captchaPassed ? this.captchaResponse?.resolved : null,
		};
	}

	isFormValid(): boolean {
		this.displayValidationErrors = !this.captchaPassed;
		return this.form.valid && ((this.displayCaptcha && this.captchaPassed) || !this.displayCaptcha) ? true : false;
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
