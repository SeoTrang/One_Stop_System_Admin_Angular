import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateDepartment, Department, DepartmentDetail, UpdateDepartment } from "@core/models/department";
import { Faculties } from "@core/models/Faculties";
import { environment } from "@env";
import { catchError, Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FacultiesService{
    constructor(
        private http: HttpClient,
    ){}

    // addNewDepartment(data: CreateDepartment):Observable<any>{
    //     return this.http.post(environment.api+  '/department',data)
    //     // console.log(data);
        
    //     // return of('test');
    // }

    getAllFaculties():Observable<Faculties[]> {
        return this.http.get<Faculties[]>(environment.api+ '/faculties').pipe(
            catchError(error => {
                console.error('Error fetching faculties:', error);
                // Trả về một Observable rỗng hoặc một giá trị mặc định nếu cần
                return of([]);
            })
        );
    }

    // getAllDepartmentsDetail():Observable<DepartmentDetail[]> {
    //     return this.http.get<DepartmentDetail[]>(environment.api+ '/department/all-detail');
    // }

    // deleteDepartment(id: number): Observable<any>{
    //     return this.http.delete(environment.api+ '/department/'+id);
    // }

    // updateDepartment(id: number,updateDepartment:UpdateDepartment): Observable<any>{
    //     return this.http.put(environment.api+ '/department/'+id,updateDepartment);
    // }
}