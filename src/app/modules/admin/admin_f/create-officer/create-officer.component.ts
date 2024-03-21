import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CreateOfficerDto } from './dto/create-officer.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Gender } from '@core/models/gender';
import { NotificationService } from '@core/services/notification.service';
import { File2Service } from '@core/services/file2.service';
import { CreateOfficer } from '@core/models/officer';
import { DepartmentService } from '@core/services/deparment.service';
import { OfficerService } from '@core/services/officer.service';
import { LoadingService } from '@core/services/loading.service';

class DataDepartment{
  label: string;
  data: string;
}

@Component({
  selector: 'app-create-officer',
  templateUrl: './create-officer.component.html',
  styleUrls: ['./create-officer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateOfficerComponent implements OnInit {
  genders: Gender[];

  avatar ?: string| undefined;
  
  input_avatar: any;

  createOfficerDto: CreateOfficerDto;

  password: string| undefined;
  confirmPassword: string| undefined; 

  dataDepartments: any[];

  createOfficerForm: FormGroup = this.formBuilder.group({
    identifier: ['',Validators.required],
    name: ['',Validators.required],
    email: ['',Validators.required],
    address: ['',Validators.required],
    gender: ['',Validators.required],
    department_id: ['',Validators.required],
  })

  constructor(
    private formBuilder: FormBuilder,
    private notificationService:NotificationService,
    private file2Service: File2Service,
    private departmentService: DepartmentService,
    private officerService: OfficerService,
    private loadingService: LoadingService
  ) { 
    
  }

  ngOnInit(): void {
    // this.avatar = 'https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-1/425451336_1196911777943774_8896928104942580300_n.jpg?stp=dst-jpg_s320x320&_nc_cat=106&ccb=1-7&_nc_sid=5740b7&_nc_eui2=AeFwiMQSllDUyFt5WU_-gpNxnp9yo23a8Iyen3KjbdrwjMvuDeSKyw51Pkwp0QI-Lo1-t6LOE1tOHZDKox3O0M3C&_nc_ohc=_SxLPKRIawIAX86ZrjB&_nc_ht=scontent.fhan15-1.fna&oh=00_AfCX3LGMgZN16whjJVTNJpy_lNbumChn7z1UfSCgkXL9MA&oe=65EB41EB'
    this.createOfficerDto = new CreateOfficerDto();
    this.initDataDepartment();
    this.initDataGender();
  }

  convertDepartmentMenuSelectDepartment(data: any):DataDepartment[]{
    let result: DataDepartment[] = [];
    return result = data.map(item => ({
      label: item.name,
      data: item.id.toString()
  }));
  }

  initDataDepartment(): void{

    this.departmentService.getAllDepartments().subscribe({
      next: (res) => {
        const transformedData = this.convertDepartmentMenuSelectDepartment(res);
        
        this.dataDepartments = [...transformedData];
      },
      error: (error)=> {
        console.log(error);
        
      }
    })
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

  onFileSelectedAvatar(event: any) {
    const file = event.target.files[0];
    this.input_avatar = event.target.files[0];
    // console.log(event.target.files[0]);
    
    if (file) {
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
    this.createOfficerForm.reset();
    this.password = '';
    this.confirmPassword = '';
    this.avatar = '';
    
  }
  async btnAddOfficer(){
    // console.log("Avatar file : ");
    
    // console.log(this.input_avatar);

    // console.log(this.createOfficerForm);
    // console.log(this.createOfficerForm.controls['identifier'].value);

    // console.log("password : ");
    // console.log(this.password);
    // console.log("comfirm password : ");
    // console.log(this.confirmPassword);
    
    if(!this.createOfficerForm.valid){
      return this.notificationService.toastError('Vui lòng nhập đầy đủ dữ liệu !',"Thông báo");
    }

    
    
    if(!this.checkValidPassword()){
      return;
    }

    let linkAvatar = await this.file2Service.uploadFiles([this.input_avatar]);

    console.log(linkAvatar);
    

    let newOfficer: CreateOfficer = new CreateOfficer();

    newOfficer.identifier = this.createOfficerForm.controls['identifier'].value;
    newOfficer.name = this.createOfficerForm.controls['name'].value;
    newOfficer.address = this.createOfficerForm.controls['address'].value;
    newOfficer.email = this.createOfficerForm.controls['email'].value;
    newOfficer.gender = this.createOfficerForm.controls['gender'].value.data;
    newOfficer.department_id = this.createOfficerForm.controls['department_id'].value.data;
    newOfficer.password = this.password;
    newOfficer.avatar = linkAvatar[0] || null;



    console.log(newOfficer);

    this.loadingService.showLoading();
    this.officerService.createOfficer(newOfficer).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.loadingService.hideLoading();
          this.notificationService.toastSuccess("Thêm thành công!","Thông báo");
          this.resetForm();
          
        }, 500);
      },

      error: (err) => {
        this.loadingService.hideLoading();
        this.notificationService.toastError('Thêm thất bại!',"Thông báo")
      }
    })
    
    
  }

}


