import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot , CanActivate , CanActivateChild , Router , RouterStateSnapshot , UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable( {
	providedIn : 'root'
} )
export class AdminGuard implements CanActivateChild {
	private jwtHelper = new JwtHelperService();
	constructor(
		private auth : AuthService ,
		private router : Router
	) { }

	canActivateChild( childRoute : ActivatedRouteSnapshot , state : RouterStateSnapshot ) : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		// const routeActive = state.url.replace( '/admin/' , '' ).split( '?' )[ 0 ];
		// if ( routeActive !== 'content-none' && !this.auth.userPermissions.reduce( ( find , a ) => find || a.route === routeActive , false ) ) {
		// if ( routeActive !== 'content-none' && !this.auth.userCanAccess( routeActive ) ) {
		// 	void this.router.navigate( [ '/admin/content-none' ] );
		// 	return false;
		// }


		const extracted = this.jwtHelper.decodeToken( this.auth.accessToken );
		console.log("extracted jwt: ", extracted);
		if(extracted.isAdmin){
			
			return true;
		}

		this.router.navigate(['/manager/dashboard']);
		return false;
	}
}
