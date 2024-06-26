import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  requestsInProgressCount = 0;
  constructor(private spinnerService: NgxSpinnerService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isIncluded = request.url.toLowerCase().includes('/api/');

    // If the URL is NOT in the included list then DO NOT show the loading spinner.
    if (!isIncluded) {
      return next.handle(request);
    }

    this.requestsInProgressCount++;
    this.spinnerService.show('loaderSpinner');

    return next.handle(request).pipe(
      finalize(() => {
        this.requestsInProgressCount--;
        if (this.requestsInProgressCount <= 0) this.spinnerService.hide('loaderSpinner');
      })
    );
  }
}
