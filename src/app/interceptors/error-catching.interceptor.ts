import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SharedService } from '../shared/services/shared.service';

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {
  constructor(private sharedService: SharedService) {}
  errorMsg = this.sharedService.errorMsg;
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          console.log('This is client side error');
          errorMsg = `Error: ${error.error.message}`;
          this.errorMsg.next({ message: error.error.message, status: 400 });
        } else if (error.error.error) {
          const _error = error.error.error;
          console.log('This is youtube server side error');
          console.log('error.error', error);
          errorMsg = `Error Code: ${_error.code},  Message: ${_error.message}`;
          this.errorMsg.next({ message: _error.message, status: _error.code });
        } else {
          console.log('This is server side error');
          console.log('error.error', error.error);
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
          this.errorMsg.next(error.error);
        }
        console.log(errorMsg);
        return throwError(() => errorMsg);
      })
    );
  }
}
