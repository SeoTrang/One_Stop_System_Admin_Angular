import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Document } from '@core/models/document';
import { Gender } from '@core/models/gender';
import { Student } from '@core/models/student';
import { DocumenttService } from '@core/services/document.service';
import { FacultiesService } from '@core/services/faculties.service';
import { File2Service } from '@core/services/file2.service';
import { NotificationService } from '@core/services/notification.service';
import { StudentService } from '@core/services/student.service';
import { environment } from '@env';



class Faculties{
  label: string;
  data: string;
}

@Component({
  selector: 'app-student-infor',
  templateUrl: './student-infor.component.html',
  styleUrls: ['./student-infor.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StudentInforComponent implements OnInit {

  avatar ?: string| undefined;

  input_avatar: any;

  password: string| undefined;

  confirmPassword: string| undefined; 

  dataFaculties: any[];

  genders: Gender[];

  document_id = this.activatedRoute.snapshot.params['document_id'];

  document: Document;

  student: Student;

  api: string = environment.api;

  constructor(
    private facultiesService: FacultiesService,
    private notificationService: NotificationService,
    private studentService: StudentService,
    private file2Service: File2Service,
    private documentService: DocumenttService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initDataFaculties();
    this.initDataGender();
    this.onLoadDocument();
  }

  initDataGender(): void{
    this.genders = [
      {
          "label": "Nam",
          "data": "male",
          // "expandedIcon": "pi pi-folder-open",
          // "collapsedIcon": "pi pi-folder"
      },
      {
          "label": "Nữ",
          "data": "female",
          // "expandedIcon": "pi pi-folder-open",
          // "collapsedIcon": "pi pi-folder"
      }
  ]
  }

  convertFacultiesMenuSelectFaculties(data: any):Faculties[]{
    let result: Faculties[] = [];
    return result = data.map(item => ({
      label: item.name,
      data: item.id.toString()
    }));
  }


  onLoadDocument(){
     this.documentService.getById(Number(this.document_id)).subscribe({
      next: (data) => {
        console.log(data);
        
        this.document = data;
        this.onLoadStudentInfor(data.user_id)
      },

      error: (err) =>{
        console.log(err);
        
      }
     })
  }

  onLoadStudentInfor(student_id: number){
    this.studentService.getById(student_id).subscribe({
      next: (data) => {
        this.student = data
        console.log(data);
        
      },
      error: (err) => {
        console.log(err);
        
      }
    })
  }

  initDataFaculties(): void{
    this.facultiesService.getAllFaculties().subscribe({
      next: (res) => {
        if (res != null && res != undefined) {
            const transFormedData = this.convertFacultiesMenuSelectFaculties(res);
            this.dataFaculties = [...transFormedData];
        } else {
            console.log("Failed to get data from the API");
        }
    },
    error: (error) => {
        console.error('Error initializing faculties data:', error);
        // Xử lý lỗi ở đây nếu cần
    }
    })
  }

}
