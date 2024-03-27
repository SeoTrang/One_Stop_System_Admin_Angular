import { Component, Input, OnInit } from '@angular/core';
import { User } from '@core/models/user';
import { AuthService } from '@core/services/auth.service';
import { environment } from '@env';

@Component({
  selector: 'app-item-post',
  templateUrl: './item-post.component.html',
  styleUrls: ['./item-post.component.css']
})
export class ItemPostComponent implements OnInit {

  @Input() post: any;

  apiUrl: string = environment.api;
  userInfor: User;
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log(this.post);

    console.log(this.authService.getUserInfo());
    this.userInfor = this.authService.getUserInfo();
    
  }


  hasUserReacted(): boolean {
    return this.post.reactions.some((reaction: any) => reaction.user_id === this.userInfor.id && reaction.type_user == "officer");
  }

  handleReaction(){
    this.post.reactions = [...this.post.reactions,{
      user_id: this.userInfor.id,
      type_user: "officer"
    }]
  }

}
