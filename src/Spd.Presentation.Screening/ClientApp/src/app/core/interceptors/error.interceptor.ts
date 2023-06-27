import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApplicantService, OrgService, UserProfileService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private router: Router, private dialog: MatDialog) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((errorResponse: HttpErrorResponse) => {
				console.error('ErrorInterceptor errorResponse', errorResponse);

				// Handling 401 that can occur when you are logged into the wrong identity authority
				if (
					errorResponse.status == 401 &&
					(errorResponse.url?.includes(UserProfileService.ApiUsersWhoamiGetPath) ||
						errorResponse.url?.includes(UserProfileService.ApiApplicantsWhoamiGetPath) ||
						errorResponse.url?.includes(ApplicantService.ApiApplicantsInvitesPostPath) ||
						errorResponse.url?.includes(ApplicantService.ApiApplicantsUserinfoGetPath))
				) {
					this.router.navigate([AppRoutes.ACCESS_DENIED]);
					return throwError(() => new Error(message));
				}

				// Certain 404s will be handled in the component
				if (errorResponse.status == 404) {
					const orgAccessCodeGet = OrgService.ApiOrgsAccessCodeAccessCodeGetPath.substring(
						OrgService.ApiOrgsAccessCodeAccessCodeGetPath.indexOf('/api') + 1,
						OrgService.ApiOrgsAccessCodeAccessCodeGetPath.lastIndexOf('/')
					);
					if (errorResponse.url?.includes(orgAccessCodeGet)) {
						return throwError(() => errorResponse);
					}
				}

				let message = 'An error has occurred';
				let title = errorResponse.statusText ?? 'Unexpected Error';
				if (errorResponse.error) {
					if (errorResponse.error?.errors) {
						title = errorResponse.error.title;
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
					message = `<p><strong>The request failed to process due to a network error. Please retry.</strong></p>
						<p>Error Status: ${errorResponse.status}</p>
						<p>Message: ${errorResponse.message}</p>`;
				}

				const dialogOptions: DialogOptions = {
					icon: 'warning',
					type: 'warn',
					title,
					message,
					cancelText: 'Close',
				};

				this.dialog.open(DialogComponent, { data: dialogOptions });
				return throwError(() => new Error(message));
			})
		) as Observable<HttpEvent<any>>;
	}
}
