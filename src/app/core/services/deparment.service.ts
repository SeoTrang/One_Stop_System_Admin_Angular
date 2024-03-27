import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateDepartment, Department, DepartmentDetail, UpdateDepartment } from "@core/models/department";
import { environment } from "@env";
import { catchError, map, Observable, of } from "rxjs";
import { LoadingService } from "./loading.service";

@Injectable({
    providedIn: 'root'
})
export class DepartmentService{
    constructor(
        private http: HttpClient,
        private loadingService: LoadingService
    ){}

    addNewDepartment(data: CreateDepartment):Observable<any>{
        return this.http.post(environment.api+  '/department',data)
        // console.log(data);
        
        // return of('test');
    }

    getAllDepartments():Observable<Department[]> {
        this.loadingService.showLoading();
        return this.http.get<Department[]>(environment.api+ '/department').pipe(
            map((response: any) => {
                console.log(response);
                
                const data = response; // Giả sử dữ liệu nằm trong một thuộc tính 'data'
                setTimeout(() => {
                    this.loadingService.hideLoading(); // Ẩn trạng thái loading sau khi nhận dữ liệu
                }, 500); // Thời gian timeout 500ms
                return data;
              }),
              catchError(() => {
                this.loadingService.hideLoading();
                return of([])
              })
        );
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