import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountNotificationModel } from '@core/models/AccountNotification';
import { environment } from '@env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountNotificationService {

  constructor(
    private http: HttpClient
  ) { }

  getNotification(): Observable<AccountNotificationModel[]>{
    return this.http.get<AccountNotificationModel[]>(environment.api + '/notifications');
  }
}
