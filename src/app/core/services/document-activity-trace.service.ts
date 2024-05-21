import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentActivityTraceService {

  constructor(
    private http: HttpClient
  ) { }

  getDocumentActivityTraceByDocId(document_id: number): Observable <any>{
    return this.http.get(environment.api+ '/document-activity-trace/get-by-document-id/'+document_id);
  }
}
