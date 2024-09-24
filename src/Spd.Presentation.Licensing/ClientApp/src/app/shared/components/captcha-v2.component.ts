import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
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
				(resolved)="resolved($event ?? '')"
				(error)="errored($event)"
				required
			></re-captcha>
		</div>
	`,
  styles: [],
})
export class CaptchaV2Component implements OnInit {
  @Input() captchaFormGroup!: FormGroup;
  @Input() resetControl: Subject<void> = new Subject<void>();
  @Output() captchaResponse = new EventEmitter<CaptchaResponse>();
  siteKey = '';

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

  resolved($event: string) {
    this.captchaResponse.emit({
      type: $event ? CaptchaResponseType.success : CaptchaResponseType.error,
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
