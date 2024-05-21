import { Component , Input , OnInit , TemplateRef } from '@angular/core';
import { debounceTime , Subject , Subscription } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { MessageNotifyService } from '../../services/message-notify.service';
import { AutoUnsubscribeOnDestroy } from '@core/utils/decorator';
import { Router } from '@angular/router';
import { NotificationMessage } from '../../models/notification';
import { filter , map } from 'rxjs/operators';
import { AccountNotificationService } from '@core/services/account-notification.service';
import { AccountNotificationModel } from '@core/models/AccountNotification';
import { LoadingService } from '@core/services/loading.service';
import { environment } from '@env';
import { TimeAgoService } from '@core/helper/timeSince';

@Component( {
	selector    : 'sticky-notifications' ,
	templateUrl : './sticky-notifications.component.html' ,
	styleUrls   : [ './sticky-notifications.component.css' ]
} )
@AutoUnsubscribeOnDestroy()
export class StickyNotificationsComponent implements OnInit {

	@Input() contentDropDown = false;

	subscriptions = new Subscription();

	data : NotificationMessage[] = [];

	isLoading = false;

	errorLoading = false;

	countNotifications = 0;

	loadDataEvent$ = new Subject<any>();

	api: string;
	notificatios: AccountNotificationModel[];

	constructor(
		private auth : AuthService ,
		private notificationService : NotificationService ,
		private messageNotifyService : MessageNotifyService ,
		private router : Router,
		private accountNotificationService : AccountNotificationService,
		private loadingService : LoadingService,
		private timeAgoService: TimeAgoService
	) {
		const observerSocketChangeStatus           = this.messageNotifyService.socketStatus.subscribe( status => console.log( status ) );
		const observerUserOnline                   = this.messageNotifyService.onUserOnline.subscribe( status => console.log( status ) );
		const observerOnPushNotification           = this.messageNotifyService.onPushNotification.subscribe( notify => {
			notify[ '__time' ] = this.messageNotifyService.getNotifyTime( notify.params.created_at );
			this.data.unshift( notify );
			this.countNotifications = this.data.length;
		} );
		const observerCalculateTime                = this.messageNotifyService.onCalculateNotifiesTime.subscribe( () => {
			if ( this.data && this.data.length ) {
				this.data.map( r => {
					r[ '__time' ] = this.messageNotifyService.getNotifyTime( r.params.created_at );
					return r;
				} );
				this.countNotifications = this.data.length;
			}
		} );
		const observerRemoveNotificationFromTopBar = this.messageNotifyService.onRemoveNotificationFromTopBar.asObservable().subscribe(
			( code ) => {
				this.data               = this.data.filter( i => i.params.code !== code );
				this.countNotifications = this.data.length;
			}
		);
		const observerLoadData                     = this.loadDataEvent$.asObservable().pipe( debounceTime( 100 ) , filter( () => !this.isLoading ) ).subscribe( () => this.__loadData() );

		this.subscriptions.add( observerSocketChangeStatus );
		this.subscriptions.add( observerUserOnline );
		this.subscriptions.add( observerOnPushNotification );
		this.subscriptions.add( observerCalculateTime );
		this.subscriptions.add( observerRemoveNotificationFromTopBar );
		this.subscriptions.add( observerLoadData );
	}

	ngOnInit() : void {
		// this.loadData();
		this.loadData2();
		this.api = environment.api;
	}

	loadData2(){
		this.loadingService.showLoading();
		this.accountNotificationService.getNotification().subscribe({
			next: data => {
				console.log(data);
				
				this.loadingService.hideLoading()
				this.notificatios = data.map((notification) => {
					let notification2:AccountNotificationModel = notification
					notification2.updated_at = this.timeAgoService.timeSince(notification2.updated_at);
					return notification;
				});
				
				
				let notificationNotRead = data.filter((value) => {
					if(value.notification_receivers.length > 0) return !value.notification_receivers[0].is_read
					return false;
					
				});
				console.log(notificationNotRead.length);
				
				this.countNotifications = notificationNotRead.length;
			},

			error: err => {
				this.loadingService.hideLoading()
				console.log(err);
				
			}
		})
	}

	loadData() {
		this.loadDataEvent$.next( '' );
	}

	private __loadData() {
		this.isLoading = true;
		this.messageNotifyService.getUnSeenNotifications( this.auth.user.id ).pipe( map( notify => notify.map( r => this.messageNotifyService.notificationToMessage( r ) ) ) ).subscribe( {
			next  : data => {
				this.data               = data;
				this.countNotifications = this.data.length;
				this.isLoading          = false;
				this.errorLoading       = false;
				this.messageNotifyService.requireCalculateNotifiesTime();
			} ,
			error : () => {
				const message = this.auth.userLanguage.translations.messageState.loadingFail;
				this.notificationService.toastError( message );
				this.isLoading    = false;
				this.errorLoading = true;
			}
		} );
	}

	openNavContent( template : TemplateRef<any> ) {
		const size = 320;
		this.notificationService.openSideNavigationMenu( { template , size } );
	}

	closeNavMenu() {
		this.notificationService.closeSideNavigationMenu();
	}

	async getDetail( notify : NotificationMessage ) {
		console.log( notify );
		const notifyCode = this.auth.encryptData( notify.params.code );
		const navigated  = await this.router.navigate( [ 'admin/message/notification-details' ] , { queryParams : { notifyCode } } );
		if ( navigated ) {
			this.closeNavMenu();
		} else {
			this.notificationService.toastError( 'Action failure' );
		}

		// const id        = notify.id;
		// const code      = notify.code;
		// this.notificationService.notificationAreRead( { id , code } , this.auth.user.id ).subscribe();
		// if ( navigated ) {
		// 	this.closeNavMenu();
		// } else {
		// 	this.notificationService.toastError( 'Action failure' );
		// }
	}

	goToListNotifications() {
		this.notificationService.closeSideNavigationMenu();
		void this.router.navigate( [ 'admin/message/notifications' ] );
	}

	markAllAsRead() {}
}
