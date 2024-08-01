import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Question } from '@core/models/Conversation';
import { Student } from '@core/models/student';
import { AuthService } from '@core/services/auth.service';
import { ConversationService } from '@core/services/conversation.service';
import { File2Service } from '@core/services/file2.service';
import { NotificationService } from '@core/services/notification.service';
import { QuestionService } from '@core/services/question.service';
import { environment } from '@env';
import { Officer } from '@modules/admin/admin_f/officer/interface/officer.interface';

@Component({
  selector: 'app-container-detail-question',
  templateUrl: './container-detail-question.component.html',
  styleUrls: ['./container-detail-question.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ContainerDetailQuestionComponent implements OnInit {

  @Input() conversation_id: number;
  @ViewChild('questionList', { static: false }) private questionList: ElementRef;
  inputReply: string = "";
  api: string;
  questions: Question[];

  imgsInput: string[] = [];
  filesInput: string[] = [];

  fileUpLoad: File[];

  buttonSendLoading: boolean = false;

  officer: Officer;


  constructor(
    private conversationService: ConversationService,
    private file2service: File2Service,
    private authService: AuthService,
    private notificationService: NotificationService,
    private questionService: QuestionService
  ) { }

  ngOnInit(): void {
    this.api = environment.api;
    this.onLoadData();
    this.officer = this.authService.getUserInfo();
  }

  handleClickDowload(event: any, src: string) {
    event.preventDefault();
    event.stopPropagation();
    console.log(event);
    console.log(src);
  }

  onLoadData() {
    this.conversationService.getDetailConversationById(this.conversation_id).subscribe({
      next: (data) => {
        this.questions = data;
        this.autoScrollToBottom();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  isStudent(user: any): user is Student {
    return (user as Student).faculty !== undefined;
  }

  isOfficer(user: any): user is Officer {
    return (user as Officer).department !== undefined;
  }

  autoScrollToBottom() {
    if (this.questionList) {
      setTimeout(() => {
        this.questionList.nativeElement.scrollTop = this.questionList.nativeElement.scrollHeight;
      }, 0);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversation_id']) {
      this.onLoadData(); // Load data when conversation_id changes
    }
  }

  onFileSelected(event: any, type: string) {
    const files = event.target.files;
    this.fileUpLoad = files;
    this.imgsInput = [];
    this.filesInput = [];
    if (files && files.length > 0) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (type === 'image') {
            this.imgsInput.push(e.target.result);
          } else if (type === 'file') {
            this.filesInput.push(file.name);
          }
        };

        if (type === 'image') {
          reader.readAsDataURL(file);
        } else if (type === 'file') {
          reader.readAsText(file);
        }
      }
    }
  }


  buttonLoad() {
    this.buttonSendLoading = true;

    setTimeout(() => {
        this.buttonSendLoading = false
    }, 2000);
  }

  resetFrom(){
    this.imgsInput = [];
    this.filesInput = [];
    this.fileUpLoad = null;
    this.inputReply = '';
  }
  async btnSendOnclick(){
    try {
      let listLinkUrls = [];
      if(!this.inputReply) return this.notificationService.toastError('Vui lòng nhập nội dung !', "Thông báo ⚠️");
      this.buttonSendLoading = true;
      if(this.fileUpLoad){
            listLinkUrls = await this.file2service.uploadFiles(this.fileUpLoad);
        }

        console.log(listLinkUrls);
        console.log(this.inputReply);
        let type_file = this.imgsInput.length > 0 ? 'img': 'file';
        let array_media_content_temp = listLinkUrls.map((url:string) => {
          return {
            url: url,
            type: type_file
          }
        })
        let dataSave = {
          department_id: this.officer.department.id,
          content: this.inputReply,
          conversation_id: this.conversation_id,
          type_question: 'Thắc mắc',
          array_media_content: array_media_content_temp
        }
        console.log(dataSave);
        
        
        this.questionService.create(dataSave).subscribe({
          next: (data) => {
            this.resetFrom();
            this.onLoadData();
          },
          error: (error) => {

          }
        })
        setTimeout(() => {
          this.buttonSendLoading = false;
        }, 1000);
        


        
    } catch (error) {
      console.log(error);
      
    }
  }
}
