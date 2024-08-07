import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { User } from '@core/models/user';
import { AuthService } from '@core/services/auth.service';
import { PostService } from '@core/services/post.service';
import { environment } from '@env';
import { Officer } from '@modules/admin/admin_f/officer/interface/officer.interface';

@Component({
  selector: 'app-item-post',
  templateUrl: './item-post.component.html',
  styleUrls: ['./item-post.component.css']
})
export class ItemPostComponent implements OnInit {

  @Input() post: any;

  apiUrl: string = environment.api;
  userInfor: Officer;
  constructor(
    private authService: AuthService,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    console.log(this.post);

    console.log(this.authService.getUserInfo());
    this.userInfor = this.authService.getUserInfo();
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post']) {
      console.log(this.post);
      
    }
  }

  hasUserReacted(): boolean {
    return this.post.reactions.some((reaction: any) => reaction.user_id === this.userInfor.id && reaction.type_user == "officer");
  }

  handleDeleteReaction(){
    
    return this.postService.deleteReaction(Number(this.post.id)).subscribe({
      next: (data) => {

      },
      error: (err) => {

      }
    });
  }

  handleReaction(){
    this.post.reactions = [...this.post.reactions,{
      user_id: this.userInfor.id,
      type_user: "officer"
    }]


    // handle create reaciton
    return this.postService.createReaction(Number(this.post.id)).subscribe({
      next: (data) => {

      },

      error: (err)=> {

      }
    })
  }

}
