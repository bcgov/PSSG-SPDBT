import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppRoutes } from '@app/app.routes';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from 'src/app/api/services';
import { DialogOopsComponent, DialogOopsOptions } from 'src/app/shared/components/dialog-oops.component';
import { AuthProcessService } from '../services/auth-process.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(
		private authProcessService: AuthProcessService,
		private router: Router,
		private dialog: MatDialog
	) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((errorResponse: HttpErrorResponse) => {
				console.error('ErrorInterceptor errorResponse', errorResponse);

				if (errorResponse.status == 0 && errorResponse.url?.toLowerCase().endsWith('/token')) {
					// the token refresh failed. logout to prevent app from being in invalid state.
					this.authProcessService.logout();
					return throwError(() => errorResponse);
				}

				if (errorResponse.status == 400 && errorResponse.url?.includes(LoginService.ApiBizLoginGetPath)) {
					this.router.navigate([AppRoutes.ACCESS_DENIED], { state: { errorMessage: errorResponse.error?.message } });
					return throwError(() => errorResponse);
				}

				let message = 'An error has occurred';
				if (errorResponse.error) {
					if (errorResponse.error?.errors) {
						message = '<ul>';
						for (const key in errorResponse.error?.errors) {
							const value = errorResponse.error?.errors[key];
							value.forEach((val: any) => {
								message += `<li>${val}</li>`;
							});
						}
						message += '</ul>';
					} else if (errorResponse.error?.message) {
						message = errorResponse.error?.message;
					} else {
						message = errorResponse.message;
					}
				} else {
					message = `<p><strong>Technical error:</strong></p>
						<p>Error Status: ${errorResponse.status}</p>
						<p>Message: ${errorResponse.message}</p>`;
				}

				const dialogOptions: DialogOopsOptions = {
					message,
					is400Error: errorResponse.status === 400,
				};

				this.dialog.open(DialogOopsComponent, { data: dialogOptions });
				return throwError(() => errorResponse); //new Error(message));
			})
		) as Observable<HttpEvent<any>>;
	}
}
