import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApplicantService, OrgService, OrgUserService, UserProfileService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { DialogOopsComponent, DialogOopsOptions } from 'src/app/shared/components/dialog-oops.component';
import { IdentityProviderTypeCode } from '../code-types/code-types.models';
import { ConfigService } from '../services/config.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private configService: ConfigService, private router: Router, private dialog: MatDialog) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((errorResponse: HttpErrorResponse) => {
				console.error('ErrorInterceptor errorResponse', errorResponse);

				// Handling 401 that can occur when you are logged into the wrong identity authority
				if (
					errorResponse.status == 401 &&
					(errorResponse.url?.includes(UserProfileService.ApiUsersWhoamiGetPath) ||
						errorResponse.url?.includes(UserProfileService.ApiApplicantsWhoamiGetPath) ||
						errorResponse.url?.includes(UserProfileService.ApiIdirUsersWhoamiGetPath) ||
						errorResponse.url?.includes(ApplicantService.ApiApplicantsUserinfoGetPath) ||
						errorResponse.url?.includes(ApplicantService.ApiApplicantsInvitesPostPath))
				) {
					this.router.navigate([AppRoutes.ACCESS_DENIED]);
					return throwError(() => new Error('Access denied'));
				}

				if (errorResponse.status == 403 && errorResponse.url?.includes(UserProfileService.ApiApplicantsWhoamiGetPath)) {
					this.router.navigate([AppRoutes.LOGIN_FAILURE], {
						state: { identityProviderTypeCode: IdentityProviderTypeCode.BcServicesCard },
					});
					return throwError(() => new Error('Login failure'));
				}

				if (errorResponse.status == 400) {
					const addBceidPrimaryUsers = OrgUserService.ApiOrgsAddBceidPrimaryUsersOrgIdGetPath.substring(
						OrgService.ApiOrgsAccessCodeAccessCodeGetPath.indexOf('/api') + 1,
						OrgService.ApiOrgsAccessCodeAccessCodeGetPath.lastIndexOf('/')
					);
					if (errorResponse.url?.includes(addBceidPrimaryUsers)) {
						this.router.navigate([AppRoutes.ACCESS_DENIED], { state: { errorMessage: errorResponse.error?.message } });
						return throwError(() => errorResponse);
					}
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
				};

				this.dialog.open(DialogOopsComponent, { data: dialogOptions });
				return throwError(() => new Error(message));
			})
		) as Observable<HttpEvent<any>>;
	}
}
