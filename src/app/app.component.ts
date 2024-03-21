import { AfterViewInit , Component , ElementRef , HostListener , OnInit , ViewChild } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
import { NotificationService } from '@core/services/notification.service';
import { debounceTime , distinctUntilChanged , Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { AutoUnsubscribeOnDestroy } from '@core/utils/decorator';
import { APP_CONFIGS } from '@env';
import { LoadingService } from '@core/services/loading.service';

@Component( {
	selector    : 'app-root' ,
	templateUrl : './app.component.html' ,
	styleUrls   : [ './app.component.css' ]
} )

@AutoUnsubscribeOnDestroy()
export class AppComponent implements OnInit , AfterViewInit {

	private subscriptions = new Subscription();

	public isLoading = false;

	@HostListener( 'window:scroll' ) handleOnWindowScroll() {
		this.notification.pushWindowScrollEvent( window.scrollY );
	}

	@HostListener( 'window:resize' , [ '$event' ] ) onResize( event ) {
		this.checkScreenHeight();
	}

	@ViewChild( 'checkViewPortHeight' ) checkViewPortHeight : ElementRef<HTMLElement>;

	constructor(
		private messageService : MessageService ,
		private notification : NotificationService ,
		private translate : TranslateService ,
		private http : HttpClient ,
		private activatedRoute : ActivatedRoute ,
		private router : Router ,
		private primengConfig : PrimeNGConfig,
		public loadingService: LoadingService
	) {
		console.log("hello app component");
		
		const observerOnLoading = this.notification.onAppLoading.pipe( debounceTime( 50 ) , distinctUntilChanged() ).subscribe( isLoading => this.isLoading = isLoading );
		this.subscriptions.add( observerOnLoading );

		const observerOnPushNotification = this.notification.onAppToastMessage.subscribe( toast => this.messageService.add( { severity : toast.type , summary : toast.head , detail : toast.body , life : 3000 } ) );
		this.subscriptions.add( observerOnPushNotification );

		const observeReloadNewVersion = this.notification.onReloadNewVersion.asObservable().pipe( debounceTime( 100 ) ).subscribe( () => this.__reloadNewVersion() );
		this.subscriptions.add( observeReloadNewVersion );

		if ( APP_CONFIGS.multiLanguage ) {
			const languages = APP_CONFIGS.languages.map( l => l.name );
			translate.addLangs( languages );
			translate.setDefaultLang( APP_CONFIGS.defaultLanguage.name );
		}
		this.__validateHashCode();
		// const browserLang = translate.getBrowserLang();
		// translate.use( browserLang.match( /en|vn/ ) ? browserLang : 'en' );
	}

	ngAfterViewInit() : void {
		this.checkScreenHeight();
	}

	ngOnInit() : void {
		this.primengConfig.ripple               = true;
		document.documentElement.style.fontSize = '14px';
	}

	// private getCsrfToken() : Observable<any> {
	// 	const options : Object = {
	// 		headers      : new HttpHeaders( { 'content-type' : 'application/json' } ) ,
	// 		responseType : 'text'
	// 	};
	// 	return this.http.get<any>( environment.s( 'csrf-token' ) , options );
	// }

	// private static isCsrfTokenValidForAtLeastTwoMoreHours() : boolean {
	// 	const token   = localStorage.getItem( CSRF_TOKEN_KEY );
	// 	const time    = localStorage.getItem( CSRF_TOKEN_EXPIRED_KEY );
	// 	const expired = time ? parseInt( time , 10 ) : null;
	// 	return !!( token && !isNaN( expired ) && ( expired > Date.now() - 7200000 ) );
	// }
	//
	// private startCsrfToken() {
	// 	this.getCsrfToken().subscribe( {
	// 		next  : token => {
	// 			if ( typeof token === 'string' ) {
	// 				localStorage.setItem( CSRF_TOKEN_KEY , token );
	// 			}
	// 		} ,
	// 		error : () => this.getCsrfToken()
	// 	} );
	//
	// 	interval( 3600000 ).pipe( map( () => AppComponent.isCsrfTokenValidForAtLeastTwoMoreHours() ) , switchMap( valid => valid ? of( '' ) : this.getCsrfToken() ) ).subscribe(
	// 		{
	// 			next  : token => {
	// 				if ( token && typeof token === 'string' ) {
	// 					localStorage.setItem( CSRF_TOKEN_KEY , token );
	// 				}
	// 			} ,
	// 			error : r => console.error( r )
	// 		}
	// 	);
	// }

	checkScreenHeight() {
		if ( this.checkViewPortHeight && this.checkViewPortHeight.nativeElement.clientHeight ) {
			document.body.style.setProperty( '--max-screen-height' , this.checkViewPortHeight.nativeElement.clientHeight + 'px' );
		}
	}

	private __validateHashCode() {
		const parsedUrl = new URL( window.location.href );
		if ( parsedUrl.searchParams.get( '--hash-code' ) ) {
			const code = Number.parseInt( parsedUrl.searchParams.get( '--hash-code' ) );
			if ( Number.isNaN( code ) || code < ( Date.now() - ( 5 * 60000 ) ) ) {
				parsedUrl.searchParams.set( '--hash-code' , Date.now().toString() );
				window.location.replace( parsedUrl.toString() );
			} else {
				this.__cleanUrlApp();
			}
		}
	}

	private __cleanUrlApp() {
		const snapshot = this.activatedRoute.snapshot;
		const params   = { ... snapshot.queryParams };
		delete params[ '--hash-code' ];
		this.router.navigate( [] , { queryParams : params } );
	}

	private __reloadNewVersion() {
		const parsedUrl = new URL( window.location.href );
		parsedUrl.searchParams.set( '--hash-code' , Date.now().toString() );
		window.location.replace( parsedUrl.toString() );
	}

}
