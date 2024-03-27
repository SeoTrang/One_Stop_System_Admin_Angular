import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CreateStudentDto } from './dto/create-student.dto';
import { Gender } from '@core/models/gender';
import { FacultiesService } from '@core/services/faculties.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@core/services/notification.service';
import { StudentService } from '@core/services/student.service';
import { CreateStudent } from '@core/models/student';
import { File2Service } from '@core/services/file2.service';

class Faculties{
  label: string;
  data: string;
}

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateStudentComponent implements OnInit {
  avatar ?: string| undefined;

  input_avatar: any;

  createStudentDto: CreateStudentDto;

  password: string| undefined;

  confirmPassword: string| undefined; 

  dataFaculties: any[];

  genders: Gender[];

  createStudentForm: FormGroup = this.formBuilder.group({
    identifier: ['',Validators.required],
    name: ['',Validators.required],
    email: ['',Validators.required],
    address: ['',Validators.required],
    gender: ['',Validators.required],
    phone: ['',Validators.required],
    batch: ['',Validators.required],
    in_class: ['',Validators.required],
    faculty: ['',Validators.required],
  })

  constructor(
    private facultiesService: FacultiesService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private studentService: StudentService,
    private file2Service: File2Service
  ) { }

  ngOnInit(): void {
    // this.avatar = 'https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-1/425451336_1196911777943774_8896928104942580300_n.jpg?stp=dst-jpg_s320x320&_nc_cat=106&ccb=1-7&_nc_sid=5740b7&_nc_eui2=AeFwiMQSllDUyFt5WU_-gpNxnp9yo23a8Iyen3KjbdrwjMvuDeSKyw51Pkwp0QI-Lo1-t6LOE1tOHZDKox3O0M3C&_nc_ohc=_SxLPKRIawIAX86ZrjB&_nc_ht=scontent.fhan15-1.fna&oh=00_AfCX3LGMgZN16whjJVTNJpy_lNbumChn7z1UfSCgkXL9MA&oe=65EB41EB'
    this.createStudentDto = new CreateStudentDto();
    this.initDataFaculties();
    this.initDataGender();
  }

  convertFacultiesMenuSelectFaculties(data: any):Faculties[]{
    let result: Faculties[] = [];
    return result = data.map(item => ({
      label: item.name,
      data: item.id.toString()
  }));
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

  onFileSelectedAvatar(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      this.input_avatar = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.avatar = reader.result as string;
        console.log('Avatar changed:', this.avatar);
      };

      reader.readAsDataURL(file);
    }
  }

  checkValidPassword():boolean{
    if(this.password.trim().length <= 3){
      this.notificationService.toastError("Vui lòng nhập mật khẩu dài hơn 3 kí tự !","Thông báo");
      return false;
    }

    console.log(this.confirmPassword.trim() != this.password.trim());
    
    if(this.confirmPassword.trim() != this.password.trim()) {
      this.notificationService.toastError('Mật khẩu không khớp !','Thông báo')
      return false;
    }
    return true;
  }

  resetForm(){
    this.createStudentForm.reset();
    this.password = '';
    this.confirmPassword = '';
    this.avatar = '';
    
  }

  async createStudent(){
    console.log(this.createStudentForm);
    console.log(this.input_avatar);

    if(!this.createStudentForm.valid){
      return this.notificationService.toastError('Vui lòng nhập đầy đủ dữ liệu !',"Thông báo");
    }


    if(!this.checkValidPassword()){
      return;
    }
    
    let linkAvatar = await this.file2Service.uploadFiles([this.input_avatar]);

    let newStudent = new CreateStudent();

    newStudent.identifier = this.createStudentForm.controls['identifier'].value;
    newStudent.name = this.createStudentForm.controls['name'].value;
    newStudent.batch = this.createStudentForm.controls['batch'].value;
    newStudent.in_class = this.createStudentForm.controls['in_class'].value;
    newStudent.address = this.createStudentForm.controls['address'].value;
    newStudent.gender = this.createStudentForm.controls['gender'].value.data;
    newStudent.email = this.createStudentForm.controls['email'].value;
    newStudent.phone = this.createStudentForm.controls['phone'].value;
    newStudent.facultyId = this.createStudentForm.controls['faculty'].value.data;
    newStudent.password = this.password;
    newStudent.avatar = linkAvatar[0] || null;

    this.studentService.createStudent(newStudent).subscribe({
      next: (res)=> {
          if(res != false){
            this.notificationService.toastSuccess('Thêm thành công',"Thông báo");
            this.resetForm();
          }else{
            this.notificationService.toastSuccess('Thêm thất bại','Thông báo')
          }
          

      },
      error: (err)=> {
        this.notificationService.toastSuccess('Thêm thất bại','Thông báo')
      }
    })

    
  }

}
