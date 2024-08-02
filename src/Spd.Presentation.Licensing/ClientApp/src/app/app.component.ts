import { APP_BASE_HREF } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfiguration } from './api/api-configuration';
import { ConfigService } from './core/services/config.service';

@Component({
	selector: 'app-root',
	template: `
		<body class="mat-typography d-flex flex-column h-100">
			<ngx-spinner name="loaderSpinner" type="square-jelly-box" [fullScreen]="true"></ngx-spinner>
			<app-spd-header></app-spd-header>

			<ng-container *ngIf="configs$ | async">
				<router-outlet></router-outlet>
			</ng-container>

			<footer class="mt-auto">
				<app-spd-footer></app-spd-footer>
			</footer>
		</body>
	`,
	styles: [],
})
export class AppComponent {
	configs$: Observable<any>;

	constructor(
		private _apiConfig: ApiConfiguration,
		@Inject(APP_BASE_HREF) href: string,
		private configService: ConfigService
	) {
		_apiConfig.rootUrl = `${location.origin}${href}`;
		if (_apiConfig.rootUrl.endsWith('/')) {
			_apiConfig.rootUrl = _apiConfig.rootUrl.substring(0, _apiConfig.rootUrl.length - 1);
		}
		console.debug('[API rootUrl]', _apiConfig.rootUrl);

		this.configs$ = this.configService.getConfigs();
	}
}
