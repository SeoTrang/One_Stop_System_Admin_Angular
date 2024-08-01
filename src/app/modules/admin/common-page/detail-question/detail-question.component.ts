import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Conversation } from '@core/models/Conversation';
import { ConversationService } from '@core/services/conversation.service';
import { environment } from '@env';

@Component({
  selector: 'app-detail-question',
  templateUrl: './detail-question.component.html',
  styleUrls: ['./detail-question.component.css']
})
export class DetailQuestionComponent implements OnInit {

  inputValue: string;

  conversations: Conversation[];
  api: string;
  conversation_id: number;
  
  constructor(
    private _conversationsService: ConversationService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // const converastionId = this.route.snapshot.params['conversation_id'];
    // console.log(converastionId);
    // this.conversation_id = Number(converastionId)
    this.route.params.subscribe(params => {
      const conversationId = params['conversation_id'];
      this.conversation_id = +conversationId; // or parseInt(conversationId)
    });
    this.api = environment.api
    this.onLoadData();
  }

  onLoadData(){
    this._conversationsService.getAllByDepartment().subscribe({
      next: (data) => {
          this.conversations = data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onLoadDetailConversation(){
      
  }

}
