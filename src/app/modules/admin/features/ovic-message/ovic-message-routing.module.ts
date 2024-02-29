import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SingleNotificationComponent } from './components/single-notification/single-notification.component';
import { NewNotificationComponent } from './components/new-notification/new-notification.component';
import { ChatComponent } from './components/chat/chat.component';

const routes : Routes = [
	// {
	// 	path      : 'make-new-notification' ,
	// 	component : NewNotificationComponent
	// } ,
	{
		path      : 'notification-details' ,
		component : SingleNotificationComponent
	} ,
	// {
	// 	path      : 'notifications/:id' ,
	// 	component : SingleNotificationComponent
	// } ,
	{
		path      : 'notifications' ,
		component : NotificationsComponent
	} ,
	{
		path      : 'chat' ,
		component : ChatComponent
	} ,
	{
		path       : '**' ,
		redirectTo : 'notifications' ,
		pathMatch  : 'prefix'
	}
];

@NgModule( {
	imports : [ RouterModule.forChild( routes ) ] ,
	exports : [ RouterModule ]
} )
export class OvicMessageRoutingModule {}
