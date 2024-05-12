import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateAttribute, CreateAttributeFormEnum, CreateFormFile, CreateProceduralStep, CreateService, Service } from "@core/models/service";
import { environment } from "@env";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ServiceService{
    constructor(
        private http: HttpClient
    ){}

    createService(createService: CreateService): Observable<any>{
        return this.http.post(environment.api+'/service',createService);

    }

    CreateProceduralStep(createProceduralStep: CreateProceduralStep): Observable<any>{
        return this.http.post(environment.api+'/procedural-step',createProceduralStep);
    }

    createAttribute(createAttribute: CreateAttribute): Observable<any> {
        return this.http.post(environment.api+'/attribute-form-service',createAttribute);
    }

    createAttributeEnum(createAttributeEnum: CreateAttributeFormEnum, attribute_id: number): Observable<any>{
        return this.http.post(environment.api+'/attribute-form-enum/'+attribute_id,createAttributeEnum);
    }

    createFormFile(createFormFile: CreateFormFile): Observable<any>{
        return this.http.post(environment.api+'/form-file',createFormFile);
    }



    getAllServices(): Observable<Service[]>{
        return this.http.get<Service[]>(environment.api+ '/service/all-detail');
    }
}