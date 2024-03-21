import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';
import { ContentNoneComponent } from '@modules/admin/features/content-none/content-none.component';
import { DashboardComponent } from '@modules/admin/dashboard/dashboard.component';
import { NewHomeComponent } from '@modules/admin/features/new-home/new-home.component';
import { AdminGuard } from '@core/guards/admin.guard';
import { OfficerComponent } from './admin_f/officer/officer.component';

const routes : Routes = [
	{
		path             : '' ,
		component        : DashboardComponent ,
		// canActivateChild : [ AdminGuard ] ,
		children         : [
			{
				path      : 'dashboard' ,
				component : NewHomeComponent
			} ,
			{
				path      : 'content-none' ,
				component : ContentNoneComponent
			} ,
			// {
			// 	path         : 'he-thong' ,
			// 	loadChildren : () => import('@modules/admin/features/he-thong/he-thong.module').then( m => m.HeThongModule )
			// } ,
			{
				path         : 'message' ,
				loadChildren : () => import('@modules/admin/features/ovic-message/ovic-message.module').then( m => m.OvicMessageModule )
			} ,
			{
				path: 'admin',
				// canActivateChild : [ AdminGuard ],
				loadChildren: () => import('@modules/admin/admin_f/admin-f.module').then( m => m.AdminFModule )

			},
			// {
			// 	path       : '' ,
			// 	redirectTo : '/manager/dashboard' ,
			// 	pathMatch  : 'prefix'
			// } ,
			// {
			// 	path       : '**' ,
			// 	redirectTo : '/manager/content-none' ,
			// 	pathMatch  : 'prefix'
			// }
		]
	}
];

@NgModule( {
	imports : [ RouterModule.forChild( routes ) ] ,
	exports : [ RouterModule ]
} )
export class AdminRoutingModule {}
