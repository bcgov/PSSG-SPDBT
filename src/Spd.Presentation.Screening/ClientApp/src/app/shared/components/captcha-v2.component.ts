import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-captcha-v2',
	template: `
		<div [formGroup]="captchaForm">
			<div class="row mt-3">
				<div class="col-sm-12 mb-2">
					<re-captcha
						formControlName="token"
						[siteKey]="siteKey"
						(resolved)="resolved($event)"
						(error)="errored($event)"
						required
					></re-captcha>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-12 mb-2">
					<button type="button" class="btn btn-sm btn-primary" (click)="onSend()">Send</button>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class CaptchaV2Component implements OnInit {
	@Output() captchaResponse = new EventEmitter<CaptchaResponse>();
	captchaForm: FormGroup = new FormGroup({
		token: new FormControl('', Validators.required),
	});
	siteKey: string = '6LeU62UlAAAAAD1RkSydHX6_7_zekmvxTSJpy9qw';

	// constructor() {
	// 	//private configService: ConfigService) {
	// 	// this.captchaKey = this.configService?.configuration?.captcha?.key;
	// }

	ngOnInit(): void {
		// 	this.captchaForm = new FormGroup({
		// 		token: new FormControl(null, Validators.required),
		// 	});
	}

	resolved($event: any) {
		this.captchaResponse.emit({
			type: CaptchaResponseType.success,
			resolved: $event,
		});
	}

	errored($event: any) {
		console.debug('[CaptchaV2Component] errored', $event);
		this.captchaResponse.emit({
			type: CaptchaResponseType.error,
			error: $event,
		});
	}

	public onSend(): void {
		if (this.captchaForm.invalid) {
			for (const control of Object.keys(this.captchaForm.controls)) {
				this.captchaForm.controls[control].markAsTouched();
			}
			return;
		}
		console.debug(`[CaptchaV2Component] Token [${this.captchaForm.value.token}] generated`);
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
