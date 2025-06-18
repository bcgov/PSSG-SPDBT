import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { RecaptchaComponent } from 'ng-recaptcha-2';
import { Subject } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config.service';
@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'app-captcha-v2',
	template: `
		<div [formGroup]="captchaFormGroup">
			<re-captcha
				formControlName="token"
				[siteKey]="siteKey"
				[size]="'invisible'"
				(resolved)="onReCaptchaResolved($event ?? '')"
				(errored)="onReCaptchaErrored($event)"
				required
			></re-captcha>
			<button mat-flat-button color="primary" class="large w-auto mt-2" (click)="onVerifyReCaptcha()">
				Agree to reCaptcha Verification
			</button>
			<div class="mt-2" aria-live="polite" role="status">
				{{ reCaptchaStatusMessage }}
			</div>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class CaptchaV2Component implements OnInit {
	@Input() captchaFormGroup!: FormGroup;
	@Input() resetControl: Subject<void> = new Subject<void>();
	@Output() captchaResponse = new EventEmitter<CaptchaResponse>();
	siteKey = '';
	reCaptchaStatusMessage = '';

	@ViewChild(RecaptchaComponent) recaptcha!: RecaptchaComponent;

	constructor(private configService: ConfigService) {
		this.siteKey = this.configService.configs?.recaptchaConfiguration?.key!;
	}

	ngOnInit() {
		this.resetControl.subscribe(() => this.reset());
	}

	reset(): void {
		this.captchaFormGroup.reset();
		grecaptcha.reset();
	}

	onVerifyReCaptcha(): void {
		// Trigger the invisible reCAPTCHA
		this.recaptcha.execute();
	}

	onReCaptchaResolved($event: string) {
		this.reCaptchaStatusMessage = '';

		const reCaptchaType = $event ? CaptchaResponseType.success : CaptchaResponseType.error;
		this.captchaResponse.emit({
			type: reCaptchaType,
			resolved: $event,
		});

		if (reCaptchaType === CaptchaResponseType.success) {
			setTimeout(() => {
				this.reCaptchaStatusMessage = 'reCaptcha successfully verified';
			}, 100); // Small delay helps ensure the change is recognized
		}
	}

	onReCaptchaErrored($event: any) {
		this.reCaptchaStatusMessage = '';

		this.captchaResponse.emit({
			type: CaptchaResponseType.error,
			error: $event,
		});

		setTimeout(() => {
			this.reCaptchaStatusMessage = 'reCaptcha failed';
		}, 100); // Small delay helps ensure the change is recognized
	}
}

export interface CaptchaResponse {
	type: CaptchaResponseType;
	resolved?: string;
	error?: string;
}

export enum CaptchaResponseType {
	success = 'SUCCESS',
	error = 'ERROR',
}
