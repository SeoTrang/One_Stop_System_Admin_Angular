import { Injectable } from '@angular/core';
import {
  UserSignIn,
  GoogleSignIn,
  Auth,
  Permission,
  Token,
} from '@core/models/auth';
import {
  of,
  Observable,
  distinctUntilChanged,
  debounceTime,
  switchMap,
  forkJoin,
  BehaviorSubject,
  mergeMap,
  lastValueFrom,
  Subject,
} from 'rxjs';
import { catchError, filter, map, take, tap } from 'rxjs/operators';
import {
  environment,
  APP_STORES,
  UCASE_KEY,
  ROLES_KEY,
  ENCRYPT_KEY,
  USER_KEY,
  EXPIRED_KEY,
  META_KEY,
  APP_CONFIGS,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  USER_ROLE_KEY,
} from '@env';
import { User, UserMeta } from '@core/models/user';
import { Ucase, UcaseAdvance } from '@core/models/ucase';
import { UserService } from '@core/services/user.service';
import * as CryptoJS from 'crypto-js';
import { TranslateService } from '@ngx-translate/core';
import { LangChangeEvent } from '@ngx-translate/core/lib/translate.service';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Officer } from '@modules/admin/admin_f/officer/interface/officer.interface';

interface AppChangeLangEvent {
  lang: string;
  updateMetaData: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper = new JwtHelperService();

  private _user: Officer;

  private _userMeta: UserMeta[];

  private auth: Auth;

  private _languageSettings: LangChangeEvent;

  private appLanguage$ = new BehaviorSubject<LangChangeEvent>(null);

  private triggerChangeLanguages$ = new Subject<AppChangeLangEvent>();

  private onSetUser$ = new BehaviorSubject<Officer>(null);

  private onSignIn$ = new BehaviorSubject<string>(null);

  private onSignOut$ = new BehaviorSubject<string>(null);

  public roles$ = new Subject<any>();

  private _roles: string[] = [];

  private _useCases: Ucase[] = [];

  private _mapPms = new Map<string, UcaseAdvance>();

  private _options: {};

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private translate: TranslateService
  ) {
    this.translate.onLangChange
      .asObservable()
      .pipe(distinctUntilChanged())
      .subscribe((settings) => this.setLanguageSettings(settings));
    this.triggerChangeLanguages$
      .asObservable()
      .pipe(
        filter((value) => value !== undefined && value !== null),
        debounceTime(100),
        mergeMap((lang) => this.updateUserMetaLanguage(lang))
      )
      .subscribe((lang) => this.translate.use(lang));
    // load stored data
    this.loadStoredUserLanguage();
    // this.loadStoredUseCases();
    this.loadStoredRoles();
    this.loadStoredUser();
    this.loadStoredUserMeta();

    if (this.isLoggedIn()) {
      this.onSignIn$.next(this.accessToken);
    }
  }

  login(user: UserSignIn | GoogleSignIn): Observable<boolean> {
    const url = environment.api + '/auth/officer/login';
    return this.http.post<Auth>(url, user).pipe(
      switchMap((auth) => this.startSession(auth)),
      catchError(() => of(false))
    );
  }

  isAdmin(): boolean {
    const userInfor = this.jwtHelper.decodeToken(this.accessToken);
    console.log(userInfor);
    return Boolean(userInfor.isAdmin);
  }

  async logout(): Promise<boolean> {
    try {
      await lastValueFrom(this.http.get<any>(environment.getRoute('logout')));
      this.removeSession();
      return Promise.resolve(true);
    } catch {
      this.removeSession();
      return Promise.resolve(false);
    }
  }

  isLoggedIn() {
    let isLoggedIn: boolean;
    if (this.refreshToken) {
      // isLoggedIn = this.accessToken && !this.jwtHelper.isTokenExpired( this.accessToken );
      isLoggedIn = !!this.accessToken;
    } else {
      const time = localStorage.getItem(EXPIRED_KEY);
      const expired = time ? new Date(time) : new Date();
      isLoggedIn = expired && expired > new Date();
    }
    return isLoggedIn;
  }

  get accessToken(): string {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  set accessToken(token: string) {
    console.log('set accessToken', token);

    localStorage.setItem(ACCESS_TOKEN, token);
  }

  get refreshToken(): string {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  set refreshToken(token: string) {
    console.log('set refreshToken', token);
    localStorage.setItem(REFRESH_TOKEN, token);
  }

  callRefreshToken() {
    const url = environment.getRoute('refresh-token');
    return this.http
      .post<Token>(url, { refresh_token: this.refreshToken })
      .pipe(tap((token) => (this.accessToken = token.access_token)));
  }

  private startSession(auth: Auth | Token): Observable<boolean> {
    if (auth.hasOwnProperty('access_token')) {
     
      console.log(auth.hasOwnProperty('access_token'));

      this.saveToken(auth as Token);

      this.onSignIn$.next(auth['access_token']);

      const url = environment.api + '/officer/profile';
      this.http
        .get<any>(url)
        .pipe(
          tap((res: Response) => this.setUserMetaConfig(res)),
          catchError(() => of(false))
        )
        .subscribe();
    } else {
      console.log('vao 1 ===');
      this.saveAuth(auth as Auth);
      this.onSignIn$.next(auth['session_id']);
    }
    return of(true);

    // return forkJoin( [
    // 	this.userService.getUserMeta() ,
    // 	this.http.get<Permission>( environment.getRoute( 'permission' ) )
    // 	] ).pipe(
    // 	map( ( [ meta , { roles , menus } ] ) => {
    // 		const menu = menus.map( o => {
    // 			if ( o.id === 'he-thong' ) {
    // 				o.child = o.child.filter( i => i.id !== 'he-thong/quan-ly-nhom-quyen' );
    // 			}
    // 			return o;
    // 		} );

    // 		if ( APP_CONFIGS.multiLanguage ) {
    // 			const metaLang = meta.find( m => m.meta_key === APP_CONFIGS.metaKeyLanguage );
    // 			const lang     = metaLang ? metaLang.meta_value : APP_CONFIGS.defaultLanguage.name;
    // 			this.storeUserLanguage( lang , false );
    // 		} else {
    // 			this.storeUserLanguage( APP_CONFIGS.defaultLanguage.name , false );
    // 		}
    // 		this.setUserMeta( meta );
    // 		this.storeRoles( roles );
    // 		this.storeUseCases( menu );
    // 		return true;
    // 	} )
    // );
  }

  setUserMetaConfig(user: any) {
    console.log(user);
    this.setUserInfo(user);
    this.setUserRole(user.roles);
    this.user = user;
  }

  setUserInfo(user: any) {
    const encrypt = this.encryptData(JSON.stringify(user));
    localStorage.setItem(USER_KEY, encrypt);
  }

  getUserInfo(): Officer {
    if(this._user) return this._user;
    const encrypt = localStorage.getItem(USER_KEY);
    if (encrypt) {
      const decryptedData = this.decryptData(encrypt);
      return JSON.parse(decryptedData);
    }
    return null; // Trả về null nếu không có dữ liệu trong localStorage
  }

  setUserRole(roles: any) {
    console.log("setUserRole", roles);
    
    const encrypt = this.encryptData(JSON.stringify(roles));
    localStorage.setItem(USER_ROLE_KEY, encrypt);
    this.roles$.next(roles);
  }

  getUserRoles(): any {
    console.log("getUserRole");
    const role = localStorage.getItem(USER_ROLE_KEY);
    // console.log(role);
    
    const decrypt = role ? this.decryptData(role) : null;
    // console.log(decrypt);
    
    return decrypt ? JSON.parse(decrypt) : null;
  }

  removeSession() {
    this.onSignOut$.next('removeSession');
    this.auth = null;
    this.user = null;
    this._roles = [];
    this._useCases = [];
    this._mapPms.clear();
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRED_KEY);
    localStorage.removeItem(UCASE_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    localStorage.removeItem(ROLES_KEY);
    localStorage.removeItem(META_KEY);
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }

  forgetPassword(email: string): Observable<any> {
    const home_url = environment.home_url;
    const callback = home_url.concat('/reset-password');
    return this.http.post(''.concat(environment.api, 'forget-password'), {
      to: email,
      callback,
      home_url,
    });
  }

  get user(): Officer {
    return this._user;
  }

  set user(user: Officer) {
    this._user = JSON.parse(JSON.stringify(user));
    if (user) {
      console.log("test xem vo khong");
      
      const none = new Date().valueOf();
      this._user.avatar = user.avatar
        ? [user.avatar, '?v=', none.toString()].join('')
        : '../../assets/images/a_none.jpg';
      this.onSetUser$.next(this._user);
    }
  }

  updateUser(user: Officer) {
    console.log(user);

    this.user = user;
    const encrypt = this.encryptData(JSON.stringify(user));
    localStorage.setItem(USER_KEY, encrypt);
  }

  onSetUpUser(): Observable<Officer> {
    console.log("onSetUpUser Observable");
    
    return this.onSetUser$;
  }

  private saveToken(token: Token) {
    console.log(token);

    // this.updateUser( auth.user );
    // const { data } : { data : User } = this.jwtHelper.decodeToken( token.access_token );
    const extracted = this.jwtHelper.decodeToken(token.access_token);
    console.log('extracted jwt: ', extracted);

    // this.updateUser( extracted.data );
    console.log(token);

    this.accessToken = token.access_token;
    this.refreshToken = token.refresh_token;
    localStorage.removeItem(EXPIRED_KEY);
  }

  private saveAuth(auth: Auth) {
    this.updateUser(auth.user);
    localStorage.setItem(ACCESS_TOKEN, auth.session_id);
    localStorage.setItem(EXPIRED_KEY, auth.expires);
    localStorage.removeItem(REFRESH_TOKEN);
  }

  private loadStoredUser() {
    const u = localStorage.getItem(USER_KEY);
    console.log(u); 
    
    const decrypt = u ? this.decryptData(u) : null;
    this.user = decrypt ? JSON.parse(decrypt) : null;
  }

  private storeRoles(roles: string[]) {
    this._roles = roles;
    const _data = roles && roles.length ? roles : [];
    const encrypt = this.encryptData(JSON.stringify(_data));
    localStorage.setItem(ROLES_KEY, encrypt);
  }

  get roles(): string[] {
    return this._roles;
  }

  private loadStoredRoles() {
    const stored = localStorage.getItem(ROLES_KEY);
    const decrypt = stored ? this.decryptData(stored) : '';
    this._roles = decrypt ? JSON.parse(decrypt) : [];
  }

  private storeUseCases(useCases: Ucase[]) {
    this.setUseCases(useCases);
    const _data = useCases && useCases.length ? useCases : [];
    const encrypt = this.encryptData(JSON.stringify(_data));
    localStorage.setItem(UCASE_KEY, encrypt);
  }

  // get useCases() : Ucase[] {
  // 	return this._useCases;
  // }

  private setUseCases(useCases: Ucase[]) {
    this._useCases = useCases;
    this._mapPms.clear();
    useCases.forEach((node) => {
      this._mapPms.set(node.id, {
        id: node.id,
        icon: node.icon,
        title: node.title,
        position: node.position,
        pms: node.pms,
        canAccess: !!node.pms[0],
        canAdd: !!node.pms[1],
        canEdit: !!node.pms[2],
        canDelete: !!node.pms[3],
      });
      if (node.child && node.child.length) {
        node.child.forEach((child) =>
          this._mapPms.set(child.id, {
            id: child.id,
            icon: child.icon,
            title: child.title,
            position: child.position,
            pms: child.pms,
            canAccess: !!child.pms[0],
            canAdd: !!child.pms[1],
            canEdit: !!child.pms[2],
            canDelete: !!child.pms[3],
          })
        );
      }
    });
  }

  // private loadStoredUseCases() {
  // 	const stored  = localStorage.getItem( UCASE_KEY );
  // 	const decrypt = stored ? this.decryptData( stored ) : '';
  // 	this.setUseCases( decrypt ? JSON.parse( decrypt ) : [] );
  // }

  userCanAccess(route: string): boolean {
    if (this._mapPms.size === 0 || !this._mapPms.has(route)) {
      return false;
    }
    return this._mapPms.get(route).canAccess;
  }

  userCanAdd(route: string): boolean {
    if (this._mapPms.size === 0 || !this._mapPms.has(route)) {
      return false;
    }
    return this._mapPms.get(route).canAdd;
  }

  userCanEdit(route: string): boolean {
    if (this._mapPms.size === 0 || !this._mapPms.has(route)) {
      return false;
    }
    return this._mapPms.get(route).canEdit;
  }

  userCanDelete(route: string): boolean {
    if (this._mapPms.size === 0 || !this._mapPms.has(route)) {
      return false;
    }
    return this._mapPms.get(route).canDelete;
  }

  getUseCase(route: string): Ucase {
    console.log(route);
    console.log(this._mapPms);
    console.log(this._mapPms.get(route));

    return this._mapPms.get(route);
  }

  userHasRole(roleName: string): boolean {
    return -1 !== this._roles.findIndex((r) => roleName === r);
  }

  get userLanguage(): LangChangeEvent {
    return this._languageSettings;
  }

  appLanguageSettings(): Observable<LangChangeEvent> {
    return this.appLanguage$.asObservable();
  }

  setLanguageSettings(settings: LangChangeEvent) {
    this._languageSettings = settings;
    this.appLanguage$.next(settings);
  }

  changeUserLanguage(lang: string) {
    this.storeUserLanguage(lang, true);
  }

  storeUserLanguage(lang: string, updateMetaData = false) {
    // localStorage.setItem( 'lang' , lang );
    this.triggerChangeLanguages$.next({ lang, updateMetaData });
  }

  loadStoredUserLanguage() {
    let stored = APP_CONFIGS.multiLanguage
      ? localStorage.getItem('lang')
      : APP_CONFIGS.defaultLanguage.name;
    this.triggerChangeLanguages$.next({
      lang: stored || APP_CONFIGS.defaultLanguage.name,
      updateMetaData: false,
    });
  }

  get userMeta(): UserMeta[] {
    return this._userMeta;
  }

  setUserMeta(meta: UserMeta[]) {
    this._userMeta = meta;
    const _data = meta && meta.length ? meta : [];
    const encrypt = this.encryptData(JSON.stringify(_data));
    localStorage.setItem(META_KEY, encrypt);
  }

  get cloudStore(): string {
    const meta =
      this._userMeta && Array.isArray(this._userMeta)
        ? this._userMeta.find((m) => m.meta_key === APP_CONFIGS.metaKeyStore)
        : null;
    return meta ? meta.meta_value : null;
  }

  private loadStoredUserMeta() {
    const stored = localStorage.getItem(META_KEY);
    const decrypt = stored ? this.decryptData(stored) : '';
    this._userMeta = decrypt ? JSON.parse(decrypt) : [];
  }

  encryptData(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, ENCRYPT_KEY).toString();
    } catch (e) {
      return '';
    }
  }

  decryptData(data: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(data, ENCRYPT_KEY);
      if (bytes.toString()) {
        return bytes.toString(CryptoJS.enc.Utf8);
      }
      return data;
    } catch (e) {
      return '';
    }
  }

  getOption(keyName: string) {
    this.getStoredAuthOptions();
    return !!(keyName && this._options[keyName])
      ? this._options[keyName]
      : null;
  }

  setOption(keyName: string, value: any) {
    this.getStoredAuthOptions();
    this._options[keyName] = value;
    const encrypt = this.encryptData(JSON.stringify(this._options));
    localStorage.setItem(APP_STORES, encrypt);
  }

  private getStoredAuthOptions() {
    if (!this._options) {
      const stored = localStorage.getItem(APP_STORES);
      const decrypt = stored ? this.decryptData(stored) : '';
      this._options = decrypt ? JSON.parse(decrypt) : {};
    }
    return this._options;
  }

  private updateUserMetaLanguage(
    settings: AppChangeLangEvent
  ): Observable<string> {
    if (this.user && settings.updateMetaData) {
      return this.userService
        .createNewMeta({
          user_id: this.user.id,
          meta_key: APP_CONFIGS.metaKeyLanguage,
          meta_title: 'User language',
          meta_value: settings.lang,
        })
        .pipe(
          tap(() => localStorage.setItem('lang', settings.lang)),
          map(() => settings.lang)
        );
    } else {
      return of(settings.lang);
    }
  }

  get onSignIn(): Observable<string> {
    return this.onSignIn$;
  }

  get onSignOut(): Observable<string> {
    return this.onSignOut$;
  }

  resetPassword(info: {
    token: string;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.http.post(environment.getRoute('reset-password'), info);
  }


  async getAllRoles(): Promise<any>{
    // try {
    //   const data = await this.http.get(environment.api+'/role').toPromise();
    //   return data;
    // } catch (error) {
    //   console.error('Đã xảy ra lỗi:', error);
    //   throw error; // Rethrow lỗi nếu có
    // }

    // const request$ = this.http.get(environment.api+'/role').pipe(take(1));

    // return await lastValueFrom<any>(request$);

    const response = await lastValueFrom(this.http.get<any[]>(environment.api + '/role'));
    return response;
    // this.http
    //     .get<any>(url)
    //     .pipe(
    //       tap((res: Response) => this.setUserMetaConfig(res)),
    //       catchError(() => of(false))
    //     )
    //     .subscribe();
  }
}
