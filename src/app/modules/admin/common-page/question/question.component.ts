import { Component, OnInit } from '@angular/core';


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
  constructor() { }

  ngOnInit(): void {
    this.typeQuestion = [
            { name: 'Tất cả' },
            { name: 'Thắc mắc' },
            { name: 'Câu hỏi' },
        ];
  }

}
