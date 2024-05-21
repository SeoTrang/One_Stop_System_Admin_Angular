import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-container-detail-question',
  templateUrl: './container-detail-question.component.html',
  styleUrls: ['./container-detail-question.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ContainerDetailQuestionComponent implements OnInit {

  inputReply: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  handleClickDowload(event:any, src:string){
    event.preventDefault();
    event.stopPropagation();
    console.log(event);
    console.log(src);
    
    
  }

}
