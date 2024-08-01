import { Component, OnInit } from '@angular/core';
import { Conversation } from '@core/models/Conversation';
import { ConversationService } from '@core/services/conversation.service';
import { environment } from '@env';


interface Question {
  name: string;
}
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  typeQuestion: Question[] | undefined;

  selectedTypeQuestion: Question | undefined;

  inputValue: string;

  conversations: Conversation[];
  api: string;
  constructor(
    private _conversationsService: ConversationService
  ) { }

  ngOnInit(): void {
    this.api = environment.api;
    this.typeQuestion = [
            { name: 'Tất cả' },
            { name: 'Thắc mắc' },
            { name: 'Câu hỏi' },
        ];
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

}
