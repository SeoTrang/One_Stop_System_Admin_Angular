import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateOfficer } from "@core/models/officer";
import { environment } from "@env";
import { catchError, map, Observable, of } from "rxjs";
import { LoadingService } from "./loading.service";

@Injectable({
    providedIn: 'root'
})

export class OfficerService{

    constructor(
        private http: HttpClient
    ){

    }

    createOfficer(createOfficer: CreateOfficer): Observable<boolean> {
        return this.http.post(environment.api + '/officer', createOfficer)
            .pipe(
                map(() => true), // Trả về true khi thành công
                catchError(error => {
                    console.error('Error creating officer:', error);
                    return of(false); // Trả về false khi gặp lỗi
                })
            );
    }

}
