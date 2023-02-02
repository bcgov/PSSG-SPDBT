import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent, DialogOptions } from 'projects/shared/src/public-api';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private dialog: MatDialog) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((errorResponse: HttpErrorResponse) => {
				let title = 'Error';
				let message = 'An error has occurred';
				console.error('ErrorInterceptor', errorResponse);

				if (errorResponse.error?.error) {
					const currentError = errorResponse.error.error as Error;
					if (currentError.message) {
						message = `<p><strong>${currentError.message}</strong></p>`;
					} else {
						let thisError = errorResponse.error.error as string;
						if (typeof thisError === 'string') {
							message = `<p>Error: <strong>${thisError}</strong></p>`;
						} else {
							const { status, statusText, url } = errorResponse;

							if (status === 403) {
								const httpOperation = request.method.toLowerCase();
								const operation = `httpMethod.${httpOperation}`;
								const operationMessage = `httpStatusText.${status}`;
								title = `${operation} - ${operationMessage}`;
							}

							message = `<p>Error: <strong>${status} - ${statusText}</strong></p>
								<p>Url: <strong>${url}</strong></p>`;
						}
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
