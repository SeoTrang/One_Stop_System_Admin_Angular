import { Inject , Injectable , TemplateRef } from '@angular/core';
import { debounceTime , distinctUntilChanged , Observable , Subject , Subscription , fromEvent } from 'rxjs';
import { ToastMessage } from '@core/models/message';
import { OvicButton } from '@core/models/buttons';
import { ConfirmRoundedComponent } from '@core/components/confirm-rounded/confirm-rounded.component';
import { ALERT_MODAL_OPTIONS , NORMAL_MODAL_OPTIONS , NORMAL_MODAL_OPTIONS_ROUND } from '@core/utils/syscat';
import { ConfirmComponent } from '@core/components/confirm/confirm.component';
import { PopupComponent } from '@core/components/popup/popup.component';
import { ConfirmDeleteComponent } from '@core/components/confirm-delete/confirm-delete.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { Overlay , OverlayRef } from '@angular/cdk/overlay';
import { Title } from '@angular/platform-browser';
import { TemplatePortal } from '@angular/cdk/portal';
import { filter , take } from 'rxjs/operators';
import { AlertComponent } from '@core/components/alert/alert.component';
import { AlertOptions } from '@core/models/alert';
import { APP_CONFIGS } from '@env';

interface SideNavigationMenu {
	template? : TemplateRef<any>;
	size : number;
}

@Injectable( {
	providedIn : 'root'
} )
export class NotificationService {

	private APP_LOADING$ = new Subject<boolean>();

	private LOAD_APP_NEW_VERSION$ = new Subject<boolean>();

	private APP_TOAST_MESSAGE$ = new Subject<ToastMessage>();

	private OVIC_FLEXIBLE_TEMPLATE$ = new Subject<string>();

	private CLOSE_RIGHT_CONTEXT_MENU$ = new Subject<string>();

	private CLOSE_OVIC_FLEXIBLE_TEMPLATES$ = new Subject<string>();

	private OPEN_OVIC_FLEXIBLE_TEMPLATE$ = new Subject<string>();

	private _onWindowScroll = new Subject<number>();

	private _openSideNavigationMenu = new Subject<SideNavigationMenu>();

	private _closeSideNavigationMenu = new Subject<any>();

	private messCaution = 'Cảnh báo';

	private mesNotice = 'Thông báo';

	private mesYes = 'Có';

	private mesNo = 'Không';

	private mesOk = 'Ok';

	private messConfirmAction = 'Xác nhận hành động';

	private overlayRef : OverlayRef | null;

	private subscription : Subscription;

	private sound_error = new Audio( '../../assets/sound/error.wav' );

	private sound_failure = new Audio( '../../assets/sound/failure.wav' );

	private sound_confirm = new Audio( '../../assets/sound/confirm.wav' );

	constructor(
		private modalService : NgbModal ,
		private translate : TranslateService ,
		private titleService : Title ,
		private overlay : Overlay ,
		@Inject( DOCUMENT ) private document : Document
	) {
		this.translate.onLangChange.asObservable().pipe( debounceTime( 100 ) , distinctUntilChanged() ).subscribe( {
			next : settings => {
				this.messCaution       = settings.translations.notificationService.messCaution;
				this.mesNotice         = settings.translations.notificationService.mesNotice;
				this.messConfirmAction = settings.translations.notificationService.messConfirmAction;
				this.mesYes            = settings.translations.notificationService.mesYes;
				this.mesNo             = settings.translations.notificationService.mesNo;
				this.mesOk             = settings.translations.notificationService.mesOk;
			}
		} );
	}

	get onWindowScroll() : Observable<number> {
		return this._onWindowScroll;
	}

	pushWindowScrollEvent( scrollY : number ) {
		this._onWindowScroll.next( scrollY );
	}

	get onAppToastMessage() : Observable<ToastMessage> {
		return this.APP_TOAST_MESSAGE$;
	}

	get onAppLoading() : Observable<boolean> {
		return this.APP_LOADING$;
	}

	isProcessing( isLoading = true ) {
		this.APP_LOADING$.next( isLoading );
	}

	startLoading() {
		this.isProcessing( true );
	}

	stopLoading() {
		this.isProcessing( false );
	}

	private toastMessage( message : ToastMessage ) {
		this.APP_TOAST_MESSAGE$.next( message );
	}

	toastError( body : string , _head = '' , sound = APP_CONFIGS.soundAlert ) {
		const type = 'error';
		const head = _head || this.messCaution;
		if ( sound ) {
			this.playSoundFailure();
		}
		this.toastMessage( { type , head , body } );
	}

	toastSuccess( body : string , _head = '' , sound = APP_CONFIGS.soundAlert ) {
		const type = 'success';
		const head = _head || this.mesNotice;
		if ( sound ) {
			this.playSoundConfirm();
		}
		this.toastMessage( { type , head , body } );
	}

	toastInfo( body : string , _head = '' , sound = APP_CONFIGS.soundAlert ) {
		const type = 'info';
		const head = _head || this.mesNotice;
		if ( sound ) {
			this.playSoundConfirm();
		}
		this.toastMessage( { type , head , body } );
	}

	toastWarning( body : string , _head = '' , sound = APP_CONFIGS.soundAlert ) {
		const type = 'warn';
		const head = _head || this.messCaution;
		if ( sound ) {
			this.playSoundConfirm();
		}
		this.toastMessage( { type , head , body } );
	}

	confirmRounded( htmlBody : string , textHead = '' , buttons : OvicButton[] = [] ) : Promise<OvicButton> {
		const confirmModalRef                  = this.modalService.open( ConfirmRoundedComponent , NORMAL_MODAL_OPTIONS_ROUND );
		confirmModalRef.componentInstance.head = textHead || this.messConfirmAction;
		if ( htmlBody ) {
			confirmModalRef.componentInstance.body = htmlBody;
		}
		if ( buttons && buttons.length ) {
			confirmModalRef.componentInstance.buttons = buttons;
		}
		return confirmModalRef.result;
	}

	confirm( htmlBody : string , textHead = '' , buttons : OvicButton[] = [] ) : Promise<OvicButton> {
		const confirmModalRef                  = this.modalService.open( ConfirmComponent , NORMAL_MODAL_OPTIONS );
		confirmModalRef.componentInstance.head = textHead || this.messConfirmAction;
		if ( htmlBody ) {
			confirmModalRef.componentInstance.body = htmlBody;
		}
		if ( buttons && buttons.length ) {
			confirmModalRef.componentInstance.buttons = buttons;
		}
		return confirmModalRef.result;
	}

	popup( htmlBody : string , textHead = '' ) : Promise<any> {
		const confirmModalRef                  = this.modalService.open( PopupComponent , NORMAL_MODAL_OPTIONS );
		confirmModalRef.componentInstance.head = textHead || this.mesNotice;
		if ( htmlBody ) {
			confirmModalRef.componentInstance.body = htmlBody;
		}
		return confirmModalRef.result;
	}

	confirmDelete( message : string = null , head : string = null ) : Promise<boolean> {
		const c = this.modalService.open( ConfirmDeleteComponent , NORMAL_MODAL_OPTIONS );
		if ( head ) {
			c.componentInstance.head = head;
		}
		if ( message ) {
			c.componentInstance.message = message;
		}
		return c.result;
	}

	onChangeFlexibleTemplate() {
		return this.OVIC_FLEXIBLE_TEMPLATE$;
	}

	closeFlexibleTemplate() {
		return this.OVIC_FLEXIBLE_TEMPLATE$.next( 'close' );
	}

	openFlexibleTemplate( templateName : string ) {
		return this.OVIC_FLEXIBLE_TEMPLATE$.next( templateName );
	}

	changeFlexibleTemplate( name : 'open' | 'close' | string ) {
		return this.OVIC_FLEXIBLE_TEMPLATE$.next( name );
	}

	closeALlActiveModal( closed : any ) {
		this.modalService.dismissAll( closed );
	}

	/**********************************************
	 * open context menu
	 * *******************************************/
	openContextMenu( event : MouseEvent , menuTemplate : TemplateRef<any> , viewContainerRef , attached : any = null , disableScroll = true ) {
		this.closeContextMenu();
		if ( disableScroll ) {
			this.document.body.classList.add( 'ov-body-disable-scroll' );
		}
		const data             = {
			attached        : attached ,
			subMenuOpenLeft : document.body.clientWidth - event.pageX < 200
		};
		const positionStrategy = this.overlay.position().flexibleConnectedTo( { x : event.clientX , y : event.clientY } ).withPositions( [ { originX : 'end' , originY : 'bottom' , overlayX : 'end' , overlayY : 'top' } ] );

		this.overlayRef = this.overlay.create( { positionStrategy , scrollStrategy : this.overlay.scrollStrategies.close() } );

		this.overlayRef.attach( new TemplatePortal( menuTemplate , viewContainerRef , { $implicit : data } ) );

		this.subscription = fromEvent<MouseEvent>( document , 'click' ).pipe(
			filter( event => {
				const clickTarget = event.target as HTMLElement;
				return !!this.overlayRef && !this.overlayRef.overlayElement.contains( clickTarget );
			} ) ,
			take( 1 )
		).subscribe( () => this.closeContextMenu() );
	}

	/*******************************************************
	 * close context menu
	 * *****************************************************/
	closeContextMenu() {
		this.CLOSE_RIGHT_CONTEXT_MENU$.next( 'close' );
		this.document.body.classList.remove( 'ov-body-disable-scroll' );
		if ( this.subscription ) {
			this.subscription.unsubscribe();
		}
		if ( this.overlayRef ) {
			this.overlayRef.dispose();
			this.overlayRef = null;
		}
	}

	get eventCloseRightContextMenu$() : Observable<string> {
		return this.CLOSE_RIGHT_CONTEXT_MENU$;
	}

	/********************************************************
	 * Disable context menu
	 * ******************************************************/
	disableContextMenu( event : MouseEvent ) {
		event.preventDefault();
		event.stopPropagation();
		return;
	}

	/***************************************************
	 * Close ovic flexible templates
	 * ***************************************************/
	get onCloseOvicFlexibleTemplates() : Subject<string> {
		return this.CLOSE_OVIC_FLEXIBLE_TEMPLATES$;
	}

	closeOvicFlexibleTemplate( message : string = null ) : null {
		this.CLOSE_OVIC_FLEXIBLE_TEMPLATES$.next( message );
		return null;
	}

	/***************************************************
	 * open ovic flexible templates
	 * ***************************************************/
	get onOpenOvicFlexibleTemplate() : Subject<string> {
		return this.OPEN_OVIC_FLEXIBLE_TEMPLATE$;
	}

	openOvicFlexibleTemplate( templateName : string ) {
		this.OPEN_OVIC_FLEXIBLE_TEMPLATE$.next( templateName );
	}

	/***************************************************
	 * Alert
	 * ***************************************************/
	alert( options : AlertOptions ) : Promise<OvicButton> {
		const c                     = this.modalService.open( AlertComponent , ALERT_MODAL_OPTIONS );
		c.componentInstance.options = options;
		return c.result;
	}

	/***************************************************
	 * Alert Success
	 * ***************************************************/
	alertSuccess( title : string , message : string , label : string = this.mesOk , sound = APP_CONFIGS.soundAlert ) : Promise<OvicButton> {
		const options : AlertOptions = {
			type      : 'success' ,
			hideClose : false ,
			icon      : '../../assets/images/alert/success.svg' ,
			title     : title || this.mesNotice ,
			message   : message ,
			btnLabel  : [ label ]
		};
		if ( sound ) {
			this.playSoundConfirm();
		}
		return this.alert( options );
	}

	/***************************************************
	 * Alert Info
	 * ***************************************************/
	alertInfo( title : string , message : string , label : string = this.mesOk , sound = APP_CONFIGS.soundAlert ) : Promise<OvicButton> {
		const options : AlertOptions = {
			type      : 'info' ,
			hideClose : false ,
			icon      : '../../assets/images/alert/info.svg' ,
			title     : title || this.mesNotice ,
			message   : message ,
			btnLabel  : [ label ]
		};
		if ( sound ) {
			this.playSoundConfirm();
		}
		return this.alert( options );
	}

	/***************************************************
	 * Alert Warning
	 * ***************************************************/
	alertWarning( title : string , message : string , label : string = this.mesOk , sound = APP_CONFIGS.soundAlert ) : Promise<OvicButton> {
		const options : AlertOptions = {
			type      : 'warning' ,
			hideClose : false ,
			icon      : '../../assets/images/alert/warning.svg' ,
			title     : title || this.mesNotice ,
			message   : message ,
			btnLabel  : [ label ]
		};
		if ( sound ) {
			this.playSoundConfirm();
		}
		return this.alert( options );
	}

	/***************************************************
	 * Alert Error
	 * ***************************************************/
	alertError( title : string , message : string , label : string = this.mesOk , sound = APP_CONFIGS.soundAlert ) : Promise<OvicButton> {
		const options : AlertOptions = {
			type      : 'error' ,
			hideClose : false ,
			icon      : '../../assets/images/alert/error.svg' ,
			title     : title || this.mesNotice ,
			message   : message ,
			btnLabel  : [ label ]
		};
		if ( sound ) {
			this.playSoundFailure();
		}
		return this.alert( options );
	}

	/***************************************************
	 * Alert Confirm
	 * ***************************************************/
	alertConfirm( title : string , message : string , label : string[] = [ this.mesYes , this.mesNo ] , sound = APP_CONFIGS.soundAlert ) : Promise<OvicButton> {
		const options : AlertOptions = {
			type      : 'question' ,
			hideClose : false ,
			icon      : '../../assets/images/alert/question.svg' ,
			title     : title || this.mesNotice ,
			message   : message ,
			btnLabel  : label || [ this.mesYes , this.mesNo ]
		};
		if ( sound ) {
			this.playSoundConfirm();
		}
		return this.alert( options );
	}

	playSoundError() {
		this.sound_error.currentTime = 0;
		void this.sound_error.play();
	}

	playSoundFailure() {
		this.sound_failure.currentTime = 0;
		void this.sound_failure.play();
	}

	playSoundConfirm() {
		// if ( !this.sound_confirm.paused ) {
		// 	this.sound_confirm.pause();
		// }
		this.sound_confirm.currentTime = 0;
		void this.sound_confirm.play();
	}

	onSideNavigationMenuOpened() : Observable<SideNavigationMenu> {
		return this._openSideNavigationMenu;
	}

	openSideNavigationMenu( settings : SideNavigationMenu ) {
		this._openSideNavigationMenu.next( settings );
	}

	onSideNavigationMenuClosed() : Observable<any> {
		return this._closeSideNavigationMenu;
	}

	closeSideNavigationMenu() {
		this._closeSideNavigationMenu.next( 'close' );
	}

	get onReloadNewVersion() : Subject<boolean> {
		return this.LOAD_APP_NEW_VERSION$;
	}

	reloadNewVersion() {
		return this.LOAD_APP_NEW_VERSION$.next( true );
	}
}
