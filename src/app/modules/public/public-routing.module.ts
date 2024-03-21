import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { LoginV2Component } from './features/login-v2/login-v2.component';
import { ContentNoneComponent } from './features/content-none/content-none.component';
import { UnauthorizedComponent } from './features/unauthorized/unauthorized.component';
import { ClearComponent } from './features/clear/clear.component';
import { TestRxjsConcatenationComponent } from './features/test-rxjs-concatenation/test-rxjs-concatenation.component';

const routes : Routes = [
	{
		path      : 'test-rxjs-concatenation' ,
		component : TestRxjsConcatenationComponent
	} ,
	{
		path      : 'unauthorized' ,
		component : UnauthorizedComponent
	} ,
	{
		path      : 'clear' ,
		component : ClearComponent
	} ,
	{
		path      : 'login' ,
		component : LoginComponent
	} ,
	// {
	// 	path      : 'login-2' ,
	// 	component : LoginV2Component
	// } ,
	{
		path      : 'content-none' ,
		component : ContentNoneComponent
	} ,
	{
		path         : 'basic' ,
		loadChildren : () => import('./features/ui-components/ui-components.module').then( m => m.UiComponentsModule )
	} ,
	{
		path       : '' ,
		redirectTo : 'login' ,
		pathMatch  : 'prefix'
	} ,
	{
		path       : '**' ,
		redirectTo : 'content-none' ,
		pathMatch  : 'prefix'
	}
];

@NgModule( {
	imports : [ RouterModule.forChild( routes ) ] ,
	exports : [ RouterModule ]
} )
export class PublicRoutingModule {}
