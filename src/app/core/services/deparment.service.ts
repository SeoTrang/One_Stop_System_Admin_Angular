import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateDepartment, Department, DepartmentDetail, UpdateDepartment } from "@core/models/department";
import { environment } from "@env";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DepartmentService{
    constructor(
        private http: HttpClient,
    ){}

    addNewDepartment(data: CreateDepartment):Observable<any>{
        return this.http.post(environment.api+  '/department',data)
        // console.log(data);
        
        // return of('test');
    }

    getAllDepartments():Observable<Department[]> {
        return this.http.get<Department[]>(environment.api+ '/department');
    }

    getAllDepartmentsDetail():Observable<DepartmentDetail[]> {
        return this.http.get<DepartmentDetail[]>(environment.api+ '/department/all-detail');
    }

    deleteDepartment(id: number): Observable<any>{
        return this.http.delete(environment.api+ '/department/'+id);
    }

    updateDepartment(id: number,updateDepartment:UpdateDepartment): Observable<any>{
        return this.http.put(environment.api+ '/department/'+id,updateDepartment);
    }
}