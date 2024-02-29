import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { LoginComponent } from './features/login/login.component';
import { ResetPasswordComponent } from './features/reset-password/reset-password.component';
import { ContentNoneComponent } from './features/content-none/content-none.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginV2Component } from './features/login-v2/login-v2.component';
import { UnauthorizedComponent } from './features/unauthorized/unauthorized.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ClearComponent } from './features/clear/clear.component';
import { TestRxjsConcatenationComponent } from './features/test-rxjs-concatenation/test-rxjs-concatenation.component';

@NgModule( {
	declarations : [
		LoginComponent ,
		ResetPasswordComponent ,
		ContentNoneComponent ,
		LoginV2Component ,
		UnauthorizedComponent ,
		ClearComponent ,
		TestRxjsConcatenationComponent
	] ,
	imports      : [
		CommonModule ,
		PublicRoutingModule ,
		ReactiveFormsModule ,
		ButtonModule ,
		RippleModule
	]
	/*	providers    : [
	 {
	 provide  : 'SocialAuthServiceConfig' ,
	 useValue : {
	 autoLogin : false ,
	 providers : [
	 {
	 id       : GoogleLoginProvider.PROVIDER_ID ,
	 provider : new GoogleLoginProvider( '973389896263-82pnr0ieien6ud03fkvqfckdoc9673f5.apps.googleusercontent.com' )
	 }
	 ] ,
	 onError   : err => console.error( err )
	 } as SocialAuthServiceConfig
	 }
	 ]*/
} )
export class PublicModule {}
