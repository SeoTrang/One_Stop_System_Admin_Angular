import { Injectable } from '@angular/core';
import { NotificationService } from '@core/services/notification.service';
import { HttpHandler , HttpRequest , HttpEvent , HttpErrorResponse } from '@angular/common/http';
import { Observable , throwError , BehaviorSubject } from 'rxjs';
import { catchError , filter , take , switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ACCESS_TOKEN , environment , REFRESH_TOKEN } from '@env';
import { AuthService } from '@core/services/auth.service';
import { Token } from '@core/models/auth';

@Injectable( {
	providedIn : 'root'
} )
export class InterceptorsService {
	private root                                          = environment.root;
	private googleDrive                                   = environment.googleDrive;
	private isRefreshing                                  = false;
	private refreshTokenSubject : BehaviorSubject<string> = new BehaviorSubject<string>( null );

	constructor(
		private authService : AuthService ,
		private notificationService : NotificationService ,
		private router : Router
	) {}

	intercept( request : HttpRequest<any> , next : HttpHandler ) : Observable<HttpEvent<any>> {
		const token = localStorage.getItem( ACCESS_TOKEN );
		if ( !request.url.endsWith( 'refresh-token' ) && token ) {
			request = InterceptorsService.addToken( request , token );
		}
		if ( request.method === 'GET' ) {
			if ( request.url.indexOf( this.googleDrive ) !== -1 && request.params.has( 'next' ) ) {

			} else if ( !request.params.has( 'limit' ) ) {
				request = request.clone( { setParams : { limit : '-1' } } );
			}
		}
		return next.handle( request ).pipe( catchError( res => {
			if ( res instanceof HttpErrorResponse ) {
				const isLoginPage = this.router.isActive( 'login' , { paths : 'subset' , queryParams : 'subset' , fragment : 'ignored' , matrixParams : 'ignored' } );
				if ( res.status === 401 ) {
					if ( localStorage.getItem( REFRESH_TOKEN ) ) {
						return this.handle401Error( request , next );
					}
					if ( !isLoginPage ) {
						this.notificationService.closeALlActiveModal( null );
						this.router.navigate( [ 'login' ] ).then( () => this.notificationService.toastInfo( `Phiên làm việc của bạn đã hết hạn \n vui lòng đang nhập lại` , 'Thông báo' ) );
					}
				}

				if ( res.error && res.error[ 'message' ] ) {
					const message = res.error[ 'message' ];
					if ( typeof message === 'string' ) {
						this.notificationService.toastError( message );
					} else if ( typeof message === 'object' && Object.keys( message ).length ) {
						Object.keys( message ).forEach( key => this.notificationService.toastError( message[ key ] ) );
					}
				}
			}
			return throwError( res );
		} ) );
	}

	private static addToken( request : HttpRequest<any> , token : string ) : HttpRequest<any> {
		return request.clone( { setHeaders : { 'Authorization' : `Bearer ${ token }` } } );
	}

	private handle401Error( request : HttpRequest<any> , next : HttpHandler ) {
		if ( !this.isRefreshing ) {
			this.isRefreshing = true;
			this.refreshTokenSubject.next( null );
			return this.authService.callRefreshToken().pipe(
				switchMap( ( { access_token } : Token ) => {
					this.isRefreshing = false;
					this.refreshTokenSubject.next( access_token );
					return next.handle( InterceptorsService.addToken( request , access_token ) );
				} ) ,
				catchError( err => {
					this.refreshTokenSubject.error( 'Invalid refresh token' );
					return throwError( err );
				} )
			);
		} else {
			return this.refreshTokenSubject.pipe(
				filter( token => token != null ) ,
				take( 1 ) ,
				switchMap( access_token => next.handle( InterceptorsService.addToken( request , access_token ) ) ) );
		}
	}
}
