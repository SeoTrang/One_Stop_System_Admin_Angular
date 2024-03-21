import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env";
import { catchError, map, Observable, of, retry } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class File2Service {
    constructor(
        private http: HttpClient
    ){

    }

    packetFiles(files: File[]): FormData {
        const formData = new FormData();
        if (files && files.length) {
          for (const file of files) {
            formData.append('files', file);
          }
        }
        return formData;
      }
    
      uploadFiles(files: File[]): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post<any>(`${environment.api}/file/multiple`, this.packetFiles(files))
            .pipe(
                retry(2),
                catchError(error => {
                    console.error('Error uploading files:', error);
                    reject(error); // Phải reject promise nếu có lỗi xảy ra
                    throw error;
                    
                }),
                map(res => {
                    resolve(res); // Phải resolve promise nếu thành công
                    return;
                })
            )
            .subscribe();
        });
    }

      
}