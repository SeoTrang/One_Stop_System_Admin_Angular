import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreatePost, Post } from "@core/models/post";
import { environment } from "@env";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})


export class PostService {

    constructor(
        private http: HttpClient
    ){}

    createPost(post: CreatePost):Observable<any> {
        return this.http.post(environment.api+'/post',post);
    }

    getPost(): Observable<Post[]>{
        return this.http.get<Post[]>(environment.api+'/post');
    }
}