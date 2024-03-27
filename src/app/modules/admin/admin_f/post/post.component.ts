import { Component, OnInit } from '@angular/core';
import { posts } from './test';
import { PostService } from '@core/services/post.service';
import { Post } from '@core/models/post';
import { LoadingService } from '@core/services/loading.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  posts: Post[];
  constructor(
    private loadingService: LoadingService,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    
    this.initPostData();
  }

  initPostData(){
    this.loadingService.showLoading();
    this.postService.getPost().subscribe({
      next: (res) => {

        this.posts = res;
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, 500);
      },

      error: (err) => {
        this.loadingService.hideLoading();
      }
    })
  }

}
