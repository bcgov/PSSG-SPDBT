import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthConfigService } from 'src/app/core/services/auth-config.service';

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
		</div>
	`,
	styles: [],
})
export class CaptchaV2Component {
	@Output() captchaResponse = new EventEmitter<CaptchaResponse>();
	captchaForm: FormGroup = new FormGroup({
		token: new FormControl('', Validators.required),
	});
	siteKey: string = '';

	constructor(private authConfigService: AuthConfigService) {
		this.siteKey = this.authConfigService.configs?.recaptchaConfiguration?.key!;
	}

	resolved($event: string) {
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
