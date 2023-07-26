import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { CaptchaResponse, CaptchaResponseType } from 'src/app/shared/components/captcha-v2.component';
import { AppInviteOrgData, CrcFormStepComponent } from '../screening-application.model';

export class DeclarationModel {
	agreeToCompleteAndAccurate: string | null = null;
	agreeToShare: boolean | null = null;
}

@Component({
	selector: 'app-sa-declaration',
	template: `
		<section class="step-section p-3" *ngIf="orgData">
			<form [formGroup]="form" novalidate>
				<div class="step mb-4">
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
					<div class="row" *ngIf="orgData.shareableCrcExists">
						<div class="offset-lg-3 col-lg-6 col-md-12 col-sm-12">
							<mat-divider class="my-3"></mat-divider>
							<p class="fs-5">Share your existing criminal record check</p>
							<div>
								You have an existing criminal record check for working with
								{{ shareCrcWorksWith | options : 'EmployeeInteractionTypes' }}, issued on
								{{ shareCrcGrantedDate | date : appConstants.date.formalDateFormat : 'UTC' }}. Do you want to share the
								results of this criminal record check at no cost?
							</div>
							<mat-radio-group aria-label="Select an option" formControlName="agreeToShare">
								<mat-radio-button [value]="true"> Yes, share my existing criminal record check </mat-radio-button>
								<mat-radio-button [value]="false"> No, I'll submit a new criminal record check </mat-radio-button>
							</mat-radio-group>
							<div>
								NOTE: An organization can decide whether or not they will accept a shared criminal record check result
								and may ask you to consent to a new criminal record check.
							</div>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('agreeToShare')?.dirty || form.get('agreeToShare')?.touched) &&
									form.get('agreeToShare')?.invalid &&
									form.get('agreeToShare')?.hasError('required')
								"
								>An option must be selected</mat-error
							>
						</div>
					</div>
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
export class SaDeclarationComponent implements OnInit, CrcFormStepComponent {
	appConstants = SPD_CONSTANTS;
	booleanTypeCodes = BooleanTypeCode;
	form!: FormGroup;
	displayValidationErrors = false;

	shareCrcWorksWith: string | undefined = undefined;
	shareCrcGrantedDate: string | undefined = undefined;

	displayCaptcha = false;
	captchaPassed = false;
	captchaResponse: CaptchaResponse | null = null;

	private _orgData: AppInviteOrgData | null = null;
	@Input()
	set orgData(data: AppInviteOrgData | null) {
		if (!data) return;

		this._orgData = data;
		this.shareCrcGrantedDate = data.shareableClearanceItem?.grantedDate ?? undefined;
		this.shareCrcWorksWith = data.worksWith;

		this.form = this.formBuilder.group(
			{
				agreeToCompleteAndAccurate: new FormControl(data.agreeToCompleteAndAccurate, [Validators.requiredTrue]),
				agreeToShare: new FormControl(data.agreeToShare),
			},
			{
				validators: [
					FormGroupValidators.conditionalDefaultRequiredValidator(
						'agreeToShare',
						(form) => data.shareableCrcExists ?? false
					),
				],
			}
		);
	}
	get orgData(): AppInviteOrgData | null {
		return this._orgData;
	}

	constructor(private formBuilder: FormBuilder, private authProcessService: AuthProcessService) {}

	ngOnInit(): void {
		this.authProcessService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
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
