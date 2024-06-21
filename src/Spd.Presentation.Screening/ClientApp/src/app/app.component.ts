import { Component, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, forkJoin, map } from 'rxjs';
import { ConfigService } from './core/services/config.service';
import { OptionsService } from './core/services/options.service';
import { ApiConfiguration } from './api/api-configuration';
import { APP_BASE_HREF } from '@angular/common';

@Component({
  selector: 'app-root',
  template: `
		<body class="d-flex flex-column h-100">
			<ngx-spinner name="loaderSpinner" type="square-jelly-box" [fullScreen]="true"></ngx-spinner>
			<app-header [title]="title"></app-header>

			<ng-container *ngIf="configs$ | async">
				<router-outlet></router-outlet>
			</ng-container>

			<footer class="mt-auto">
				<app-footer></app-footer>
			</footer>
		</body>
	`,
  styles: [],
})
export class AppComponent {
  configs$ = forkJoin([this.configService.getConfigs(), this.optionsService.loadMinistries()]);
  title = '';

  constructor(
    @Inject(ApiConfiguration) apiConfig: ApiConfiguration,
    @Inject(APP_BASE_HREF) href: string,
    private configService: ConfigService,
    private optionsService: OptionsService,
    private router: Router) {

    apiConfig.rootUrl = `${location.protocol}//${location.host}${href}`;
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRouteSnapshot = this.router.routerState.root.snapshot;
          let routeTitle = '';
          if (route.firstChild) {
            route = route.firstChild;
          }
          if (route.data['title']) {
            routeTitle = route.data['title'];
          }
          return routeTitle;
        })
      )
      .subscribe((title: string) => {
        this.title = title ? title : 'Criminal Record Checks';
      });
  }
}
