import { state , style , trigger } from '@angular/animations';
import { Component , OnInit , TemplateRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NavigationEnd , Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { HelperService } from '@core/services/helper.service';
import { NotificationService } from '@core/services/notification.service';
import { delay , filter , map , mergeMap , tap } from 'rxjs/operators';
import { APP_CONFIGS , HIDDEN_MENUS } from '@env';
import { debounceTime , of , Subscription } from 'rxjs';
import { Ucase } from '@core/models/ucase';
import { AutoUnsubscribeOnDestroy } from '@core/utils/decorator';
import { LangChangeEvent } from '@ngx-translate/core/lib/translate.service';

@Component( {
	selector    : 'app-dashboard' ,
	templateUrl : './dashboard.component.html' ,
	styleUrls   : [ './dashboard.component.css' ] ,
	animations  : [
		trigger( 'dropdown' , [
			state( 'open' , style( {
				top        : '100%' ,
				opacity    : 1 ,
				visibility : 'visible'
			} ) ) ,
			state( 'close' , style( {
				top        : 'calc(100% + 13px)' ,
				opacity    : 0 ,
				visibility : 'hidden'
			} ) )
		] ) ,
		trigger( 'navigationMenuEffect' , [
			state( 'open' , style( { right : 0 } ) )
		] )
	]
} )
@AutoUnsubscribeOnDestroy()
export class DashboardComponent implements OnInit {

	isLoading = false;

	menuCollapse = false;

	mobileMenuOpen = false;

	menuActive : MenuItem = { label : 'Bảng điều khiển' , icon : 'fi-rr-dashboard' };

	menuDropdownState = 'close';

	langDropdownState = 'close';

	verticalMenu : MenuItem[] = [];

	subscriptions = new Subscription();

	menuSize = '300px';

	initRight = '-310px';

	template : TemplateRef<any>;

	navigationMenuState : 'open' | 'close' = 'close';

	bodyNoScroll = '<style>body {overflow: hidden !important; padding-right: 16.5px;}</style>';

	userRoles : any;

	constructor(
		private helperService : HelperService ,
		private router : Router ,
		private notificationService : NotificationService ,
		private auth : AuthService
	) {
		const loadMenu = this.auth.roles$.subscribe({
			next: (roles)=> {
				console.log(roles);
				this.userRoles = roles;
				this.initNavControll()
			}
		})
		const observerRouterEvents = router.events.pipe( filter( e => e instanceof NavigationEnd ) ).subscribe( ( e : NavigationEnd ) => {
			e.toString();
			console.log(e);
			console.log( e.url.substring( 7 ).split( '?' )[ 0 ]);
			
			
			const useCase   = this.auth.getUseCase( e.url.substring( 7 ).split( '?' )[ 0 ] );
			this.menuActive = useCase ? { label : useCase.title , icon : useCase.icon } : { label : 'Bảng điều khiển' , icon : 'fi-rr-dashboard' };
		} );
		this.subscriptions.add( observerRouterEvents );
		

		const observerChangeLanguage = this.auth.appLanguageSettings().pipe( filter( value => value !== undefined && value !== null ) ).subscribe(
			( settings ) => {
				const lang        = APP_CONFIGS.multiLanguage ? settings : null;
				// this.verticalMenu = this.useCase2ToMenuItem( this.auth.useCases , lang );
			}
		);
		this.subscriptions.add( observerChangeLanguage );

		const observerOpenSideNavigation = this.notificationService.onSideNavigationMenuOpened().pipe(
			debounceTime( 100 ) ,
			mergeMap( settings => {
					this.menuSize  = settings.size ? `${ settings.size }px` : '100%';
					this.initRight = '-' + ( settings.size ? `${ settings.size + 10 }px` : '110%' );
					if ( settings.template ) {
						this.template = settings.template;
					}
					return of( '' );
				}
			) , delay( 50 ) ).subscribe( () => this.navigationMenuState = 'open' );
		this.subscriptions.add( observerOpenSideNavigation );

		const observerCloseSideNavigation = this.notificationService.onSideNavigationMenuClosed().pipe( debounceTime( 100 ) ).subscribe( () => this.navigationMenuState = 'close' );
		this.subscriptions.add( observerCloseSideNavigation );
	}

	ngOnInit() : void {
		this.initNavControll()
		
    
	}

	initNavControll(){
		const isAdmin = this.auth.isAdmin();
		console.log("isAdmin: "+isAdmin);

		// console.log(this.auth.getUserRoles());
		let roles = this.userRoles || this.auth.getUserRoles();
		console.log(roles);
		roles = roles.filter(role => role.nav_menu == true);
		
		let transformedRoles = roles.map(role => {
			const { label, routerLink, icon, parent_id } = role;
			if (parent_id === null) {
				return {
					label,
					icon,
					routerLink: routerLink ? [routerLink] : null,
					items: roles.filter(child => child.parent_id === role.id).map(child => ({
						label: child.label,
						routerLink: child.routerLink ? [child.routerLink] : null
					}))
				};
			}
			return null;
		}).filter(role => role !== null);
		
		// console.log(transformedRoles);
		transformedRoles = transformedRoles.map((value)=> {
			if(value.items.length > 0){
				return value
			}else{
				const { label, routerLink, icon, items } = value;
				return {label,routerLink,icon}
			}

		})

		console.log(transformedRoles);
		

		this.verticalMenu = transformedRoles || [];
		
		// if(isAdmin) {
			// this.verticalMenu = [
			// 	{
			// 		label: "Trang chủ",
			// 		icon: 'pi pi-home',
			// 		routerLink: ['/manager/dashboard']
			// 	},
			// 	{
			// 		label: "Cán bộ giảng viên",
			// 		icon:'pi pi-users',
			// 		items:[
			// 			{
			// 				label: 'Tất cả',
			// 				routerLink: ['/manager/admin/officer']
			// 			},
			// 			{
			// 				label: 'Thêm cán bộ giảng viên',
			// 				routerLink: ['/manager/admin/create-officer']
			// 			}
			// 		]
			// 	},
			// 	{
			// 		label: "Sinh viên",
			// 		icon:'pi pi-fw pi-user',
			// 		items:[
			// 			{
			// 				label: 'Tất cả sinh viên',
			// 				routerLink: ['/manager/admin/student']
			// 			},
			// 			{
			// 				label: 'Thêm sinh viên',
			// 				routerLink: ['/manager/admin/create-student']
			// 			}
			// 		]
			// 	},
			// 	{
			// 		label: 'Dịch vụ',
			// 		icon: 'pi pi-fw pi-cog ',
			// 		items: [
			// 			{
			// 				label: 'Tất cả dịch vụ',
			// 				routerLink: ['/manager/admin/service'],
			// 				// icon: 'pi pi-fw pi-user-plus'
			// 			},
			// 			{
			// 				label: 'Top dịch vụ',
			// 			},
			// 			{
			// 				label: 'Thêm dịch vụ',
			// 				routerLink: ['/manager/admin/create-service'],
			// 			}
			// 		]
			// 	},
			// 	{
			// 		label: 'Phòng ban',
			// 		icon: 'pi pi-fw pi-briefcase',
			// 		routerLink: ['/manager/admin/department']
					
			// 	},

			// 	{
			// 		label: 'Biểu mẫu tự động',
			// 		icon: 'pi pi-file-pdf',
			// 		items: [
			// 			{
			// 				label: 'Tất cả',
			// 				routerLink: ['/manager/admin/auto-form'],
			// 				icon: ''
			// 			},
			// 			{
			// 				label: 'Thêm biểu mẫu mới',
			// 				routerLink: ['/manager/admin/create-auto-form'],
			// 				icon: ''
			// 			}
			// 		]
			// 	},
			// 	{
			// 		label: 'Thủ tục',
			// 		icon: 'pi pi-fw pi-file',
			// 		routerLink: ['/manager/admin/document']
					
			// 	},
			// 	{
			// 		label: 'Hỏi đáp',
			// 		icon: 'pi pi-fw pi-comments',
			// 		routerLink: ['/manager/admin/post']
			// 	},
			// 	{
			// 		label: 'Câu hỏi',
			// 		icon: 'pi pi-fw pi-question'
			// 	}
			// ];
		
			
	}

	useCase2ToMenuItem( data : Ucase[] , lang : LangChangeEvent = null ) : MenuItem[] {
		const t                 = lang ? lang.translations.route : null;
		let result : MenuItem[] = [];
		if ( data.length ) {
			data.forEach( node => {
				if ( !HIDDEN_MENUS.has( node.id ) ) {
					const menu = {
						label : t && t.hasOwnProperty( node.id ) ? t[ node.id ] : node.title ,
						icon  : node.icon
					};
					if ( node.child && node.child.length ) {
						menu[ 'items' ] = [];
						node.child.forEach( nodeChild => {
							if ( !HIDDEN_MENUS.has( nodeChild.id ) ) {
								menu[ 'items' ].push( {
									label      : t && t.hasOwnProperty( nodeChild.id ) ? t[ nodeChild.id ] : nodeChild.title ,
									icon       : nodeChild.icon ,
									routerLink : nodeChild.id
								} );
							}
						} );
					} else {
						menu[ 'routerLink' ] = node.id;
					}
					result.push( menu );
				}
			} );
		}
		return result;
	}

	toggleMenu() {
		this.menuCollapse = !this.menuCollapse;
	}

	toggleMenuForMobile( event : Event | null ) {
		if ( event ) {
			event.preventDefault();
			event.stopPropagation();
		}
		this.mobileMenuOpen = !this.mobileMenuOpen;
	}

	reloadPage() {
		this.notificationService.isProcessing( true );
		window.location.reload();
	}

	closePanel() {
		this.notificationService.closeSideNavigationMenu();
	}

	

}
