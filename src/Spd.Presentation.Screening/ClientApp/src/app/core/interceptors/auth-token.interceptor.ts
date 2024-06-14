import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthResourceServerErrorHandler } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthUserBceidService } from '../services/auth-user-bceid.service';
import { AuthUserIdirService } from '../services/auth-user-idir.service';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
	constructor(
		private authUserBceidService: AuthUserBceidService,
		private authUserIdirService: AuthUserIdirService,
		private authenticationService: AuthenticationService,
		private errorHandler: OAuthResourceServerErrorHandler
	) {}

	private checkUrl(url: string): boolean {
    return url.includes('/api/');
	}

	public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const url = req.url.toLowerCase();
		if (!this.checkUrl(url)) return next.handle(req);

		const token = this.authenticationService.getToken();
		if (!token) return next.handle(req);

		const header = 'Bearer ' + token;
		let headers = req.headers.set('Authorization', header);
		if (this.authUserBceidService.bceidUserInfoProfile?.orgId) {
			headers = req.headers.set('organization', this.authUserBceidService.bceidUserInfoProfile?.orgId);
		} else if (this.authUserIdirService.idirUserWhoamiProfile?.orgId) {
			headers = req.headers.set('organization', this.authUserIdirService.idirUserWhoamiProfile?.orgId);
		}

		req = req.clone({ headers });

		return next.handle(req).pipe(catchError((err) => this.errorHandler.handleError(err)));
	}
}
