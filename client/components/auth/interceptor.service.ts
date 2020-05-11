import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SocketService } from '../../components/socket/socket.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  Router;
  SocketService;

  static parameters = [Router, SocketService];
  constructor(private router: Router, private socketService: SocketService) {
    this.Router = router;
    this.SocketService = socketService;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('id_token');
            this.SocketService.setAuthorizationToken();
            if (window.self !== window.top) {
              this.Router.navigateByUrl('/login');
            }
          }

          return throwError(error);
        })
      );
  }
}
