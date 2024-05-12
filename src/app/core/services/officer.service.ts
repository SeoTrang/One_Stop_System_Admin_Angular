import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateOfficer } from "@core/models/officer";
import { environment } from "@env";
import { catchError, map, Observable, of } from "rxjs";
import { LoadingService } from "./loading.service";
import { Officer } from "@modules/admin/admin_f/officer/interface/officer.interface";

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


    getAll(): Observable<Officer[]>{
        return this.http.get<Officer[]>(environment.api+'/officer');
    }


    getByOfficerId(officer_id: number): Observable<Officer>{
        return this.http.get<Officer>(environment.api+'/officer/'+officer_id);
    }

    setRBAC(department_id: number, roles: number[], officer_id: number): Observable<any>{
        let data = {
            new_department_id: department_id,
            roles: roles
        }
        return this.http.put<any>(environment.api+'/officer/rbac/'+officer_id,{...data});
    }
}
