import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthResourceServerErrorHandler } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

const includedURLs = [/^\/api\/.+$/];

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
	constructor(
		private authenticationService: AuthenticationService,
		private errorHandler: OAuthResourceServerErrorHandler
	) {}

	private checkUrl(url: string): boolean {
		return url.toLowerCase().includes('/api/');
	}

	public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const url = req.url.toLowerCase();
		if (!this.checkUrl(url)) return next.handle(req);

		const token = this.authenticationService.getToken();
		if (!token) return next.handle(req);

		const header = 'Bearer ' + token;
		const headers = req.headers.set('Authorization', header);
		req = req.clone({ headers });

		return next.handle(req).pipe(catchError((err) => this.errorHandler.handleError(err)));
	}
}
