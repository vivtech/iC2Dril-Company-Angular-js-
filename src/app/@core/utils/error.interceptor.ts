import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

    expiry = false;
    constructor(private authenticationService: AuthenticationService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap (event => {
            if (event instanceof HttpResponse) {
                // console.log('Interceptor - event', event.body.expiring ? event.body.expiring : false);
                this.expiry = event.body.expiring ? event.body.expiring : false;
                this.authenticationService.expiryCheck(this.expiry);
            }
        }),
            catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload(true);
            }
            const error = err.error;
            return throwError(error);
        }));
    }
}
