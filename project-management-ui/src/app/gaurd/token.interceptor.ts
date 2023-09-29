import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class TokenIntercepter implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        'Authorization': 'Bearer ' + (environment.isLoggedIn ? environment.token : '')
      }
    });

    return next.handle(request);
  }
}
