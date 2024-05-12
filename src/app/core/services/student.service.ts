import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateStudent, Student } from "@core/models/student";
import { environment } from "@env";
import { catchError, map, Observable, of } from "rxjs";
import { LoadingService } from "./loading.service";

@Injectable({
    providedIn: 'root'
})

export class StudentService {
    constructor(
        private http: HttpClient,
        private loadingService: LoadingService
    ) {}

    createStudent(createStudent: CreateStudent): Observable<boolean> {
        this.loadingService.showLoading();
        return this.http.post(environment.api+'/users', createStudent).pipe(
            map(() => {
                this.loadingService.hideLoading();
                return true;
            }), // Trả về true khi request thành công
            catchError(() => {
                this.loadingService.hideLoading();
                return of(false); // Trả về false khi có lỗi
            })
        );
    }


    getAll(): Observable<Student[]>{
        return this.http.get<Student[]>(environment.api+'/users/all');
    }

    getById(id: number): Observable< Student>{
        return this.http.get<Student> (environment.api+'/users/'+id);
    }
}
