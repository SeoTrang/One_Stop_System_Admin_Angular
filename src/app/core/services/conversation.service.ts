import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Conversation, Question } from '@core/models/Conversation';
import { environment } from '@env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(
    private http: HttpClient
  ) { }

  getAllByDepartment(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(environment.api+'/conversations/get-all-by-department');
  }

  getConversationById(id: number): Observable<Conversation>{
    return this.http.get<Conversation>(environment.api+'/conversations/'+id);
  }

  getDetailConversationById(id: number): Observable<Question[]>{
    return this.http.get<Question[]>(environment.api+'/conversations/get-detail-by-conversation/'+id);
  }
}
