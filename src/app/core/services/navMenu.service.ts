import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Menu } from "@core/models/menu";
import { USER_ROLE_KEY_INIT, environment } from "@env";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class NavMenuService {
    private menuSubject = new BehaviorSubject<Menu[]>([]);

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        this.loadMenuFromLocalStorage();
    }

    getMenu(): Observable<Menu[]> {
        const menuFromSubject = this.menuSubject.asObservable();

        // Kiểm tra nếu menu đã được tải từ server hoặc localStorage, trả về nó
        if (this.menuSubject.getValue().length > 0) {
            return menuFromSubject;
        }

        // Nếu chưa có menu, thực hiện tải từ localStorage hoặc server
        const menuFromLocalStorage = this.loadMenuFromLocalStorage();
        if (menuFromLocalStorage.length > 0) {
            this.menuSubject.next(menuFromLocalStorage);
            return menuFromSubject;
        }

        // Nếu không có menu từ cả localStorage và server, thực hiện tải từ server
        return this.loadMenuFromServer();
    }

    private loadMenuFromLocalStorage(): Menu[] {
        const storedMenu = localStorage.getItem(USER_ROLE_KEY_INIT);
        if (storedMenu) {
            const decodedMenu = JSON.parse(this.authService.decryptData(storedMenu));
            this.menuSubject.next(decodedMenu);
            return decodedMenu;
        }
        return [];
    }

    private loadMenuFromServer(): Observable<any> {
        const url = environment.api + '/role/user';
        return this.http.get<any>(url).pipe(
            tap((res: any) => {
                this.menuSubject.next(res);
                this.storeMenuToLocalStorage(res);
            }),
            catchError(() => of([])) // Trả về một mảng rỗng nếu có lỗi
        );
    }

    private storeMenuToLocalStorage(menu: Menu[]): void {
        const encryptedMenu = this.authService.encryptData(JSON.stringify(menu));
        localStorage.setItem(USER_ROLE_KEY_INIT, encryptedMenu);
    }
}
