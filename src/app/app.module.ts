import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS , HttpClient , HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmComponent } from '@core/components/confirm/confirm.component';
import { PopupComponent } from '@core/components/popup/popup.component';
import { AppSafeHtmlPipe } from '@core/pipes/app-safe-html.pipe';
import { InterceptorsService } from '@core/services/interceptors.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbActiveOffcanvas , NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ConfirmRoundedComponent } from '@core/components/confirm-rounded/confirm-rounded.component';
import { ConfirmDeleteComponent } from '@core/components/confirm-delete/confirm-delete.component';
import { TranslateLoader , TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { getSaver , SAVER } from '@core/providers/saver.provider';
import { AlertComponent } from '@core/components/alert/alert.component';

import { OverlayModule } from '@angular/cdk/overlay';
import { FormBuilder } from '@angular/forms';



import { MultiSelectModule } from 'primeng/multiselect';
import { QuillModule } from 'ngx-quill';
// AoT requires an exported function for factories
export function HttpLoaderFactory( httpClient : HttpClient ) {
	return new TranslateHttpLoader( httpClient );
}

@NgModule( {
	declarations : [
		AppComponent ,
		ConfirmComponent ,
		PopupComponent ,
		AppSafeHtmlPipe ,
		ConfirmRoundedComponent ,
		ConfirmDeleteComponent ,
		AlertComponent
	] ,
	imports      : [
		BrowserModule ,
		BrowserAnimationsModule ,
		ToastModule ,
		HttpClientModule ,
		AppRoutingModule ,
		NgApexchartsModule ,
		OverlayModule ,
		NgbModule ,
		ButtonModule ,
		RippleModule ,
		TranslateModule.forRoot( {
			loader : {
				provide    : TranslateLoader ,
				useFactory : HttpLoaderFactory ,
				deps       : [ HttpClient ]
			}
		} ),
		MultiSelectModule,
		
	] ,
	providers    : [
		FormBuilder ,
		NgbActiveOffcanvas ,
		MessageService ,
		{ provide : SAVER , useFactory : getSaver } ,
		{ provide : HTTP_INTERCEPTORS , useClass : InterceptorsService , multi : true }
	] ,
	exports      : [
    
  ] ,
	bootstrap    : [ AppComponent ]
} )
export class AppModule {}
