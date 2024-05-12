import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Document, UpdateDocumentDto } from "@core/models/document";
import { environment } from "@env";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DocumenttService{
    constructor(
        private http: HttpClient,
    ){}


    getAll(): Observable<any[]> {
        return this.http.get<any[]>(environment.api + '/document/all');
    }

    updateDocumentStatus(document_id: number,updateDocumentDto: UpdateDocumentDto): Observable<any> {

        return this.http.put(environment.api+'/document/'+document_id,{...updateDocumentDto});
    }



    handleCreateDocumentActivityTrace(data: any): Observable<any> {
        return this.http.post(environment.api+'/document-activity-trace',{...data})
    }


    getById(id: number): Observable<Document>{
        return this.http.get<Document>(environment.api+ '/document/'+id);
    }
    
}