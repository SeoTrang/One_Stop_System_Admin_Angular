import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@env';

@Component({
  selector: 'app-content-post',
  templateUrl: './content-post.component.html',
  styleUrls: ['./content-post.component.css']
})
export class ContentPostComponent implements OnInit {


  @Input() contents: any;

  apiUrl: string = environment.api;
  constructor() { }

  ngOnInit(): void {
    console.log(this.contents);
    
  }

}
