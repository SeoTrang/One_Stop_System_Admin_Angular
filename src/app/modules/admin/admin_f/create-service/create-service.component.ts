import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { defer, lastValueFrom, Observable, of, shareReplay } from 'rxjs';
import 'quill-mention';
import 'quill-emoji';
import { QuillEditorComponent } from 'ngx-quill';
import { DepartmentService } from '@core/services/deparment.service';
import { NotificationService } from '@core/services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'autoprefixer';
import { CreateAttribute, CreateAttributeFormEnum, CreateFormFile, CreateProceduralStep, CreateService } from '@core/models/service';
import { LoadingService } from '@core/services/loading.service';
import { ServiceService } from '@core/services/service.service';
import { File2Service } from '@core/services/file2.service';

class DataDepartment{
  label: string;
  data: string;
}

class Step{
  data: string;
  label: string;
}

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateServiceComponent implements OnInit {
  // displayDialogAddStep: boolean = false;
  stepsBox: Step[] = [];

  contentDescription: string = "";

  

  atValues = [
    { id: 1, value: 'Fredrik Sundqvist', link: 'https://google.com' },
    { id: 2, value: 'Patrik Sjölin' },
  ];
  hashValues = [
    { id: 3, value: 'Fredrik Sundqvist 2' },
    { id: 4, value: 'Patrik Sjölin 2' },
  ];

 
  typeAttribute: any[] =
    [
      {
        data: 'Input',
        label: 'Input',
      },
      {
        data: 'Select',
        label: 'Select',
      },
      {
        data: 'Checkbox',
        label: 'Checkbox',
      },
    ] || [];

  selectNewAttribute: any;

  displayDialogAddAttribute: boolean;

  newAttributeName: string | undefined;

  listAttributes: any[];

  attributeEnumValue: string;

  displayDialogAddAttributeEnum: boolean;

  listAttributeEnumValues: string[] | undefined;

  dataDepartments: any[];

  steps: MenuItem[];

  selectNewStep: any;

  fileName: string | undefined;

  file_input: File;

  createServiceForm: FormGroup = this.formBuilder.group({
    name: ['',Validators.required],
    type: ['',Validators.required],
    time_handle: ['',Validators.required],
    department: ['',Validators.required],
  })




  constructor(
    private departmentService: DepartmentService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private serviceService: ServiceService,
    private file2Service: File2Service
  
  ) {}

  ngOnInit(): void {
    this.displayDialogAddAttribute = false;
    this.displayDialogAddAttributeEnum = false;
    this.steps = [];
    this.listAttributes = [];
    // this.steps = [
    //   {
    //     label: 'Bước 1'
    //   },
    //   { label: 'Bước 2' },
    //   { label: 'Bước 3' },
    // ];
    
    this.initDepartments()
  }

  convertDepartmentMenuSelectDepartment(data: any):DataDepartment[]{
    let result: DataDepartment[] = [];
    return result = data.map(item => ({
      label: item.name,
      data: item.id.toString()
  }));
  }


  initDepartments(){
    this.departmentService.getAllDepartments().subscribe({
      next: (res) => {
        const transformedData = this.convertDepartmentMenuSelectDepartment(res);
        
        this.dataDepartments = [...transformedData];
        console.log(res);
      },
      error: (err) => {
        console.log(err);
        
      }

    })
  }

  
  onContentDescriptionChange(newValue: string) {
    console.log(newValue);
    this.contentDescription = newValue;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.stepsBox, event.previousIndex, event.currentIndex);
    // console.log();
    this.steps = this.stepsBox.map((value) => {
      return { label: value.label };
    });
  }

  

  // showDialogAddStep() {
  //   this.displayDialogAddStep = true;
  // }

  onSelectNewStep(event: any) {
    console.log('Giá trị mới của selectNewStep:', this.selectNewStep);
  }

  onSelectNewProperty(event: any) {
    console.log('Giá trị mới của selectNewStep:', this.selectNewAttribute);
  }

  getStepNameFromDepartmentId(id: any): string{
    const data = this.dataDepartments;

    
    for (let index = 0; index < data.length; index++) {
      
      if(data[index].data == id){
        return data[index].label;
      }
      
    }
    return null;
  }

  onAddStepClick() {
    // Lấy giá trị từ p-treeSelect
    const selected = this.selectNewStep.data;
    const stepSelected = this.getStepNameFromDepartmentId(selected)
    console.log('Giá trị được chọn từ p-treeSelect:', stepSelected);
    this.steps = [...this.steps, { label: stepSelected }];
    this.stepsBox = [...this.stepsBox, {label: stepSelected, data: selected}];
    // this.displayDialogAddStep = false;
    // Tiến hành xử lý thêm bước mới
    // ...
  }

  removeMovie(stepsBox: Step) {
    console.log(stepsBox);

    let index ;
    for (let i = index = 0; i < this.steps.length; i++) {
      if(this.steps[i].label == stepsBox.label){
        index = i;
        break;
      }
      
    }
    if (index !== -1) {
      this.stepsBox.splice(index, 1);
    }
    this.steps = this.steps.filter((step) => step.label !== stepsBox.label);
  }

  onShowDialogAddAttribute(): void {
    this.displayDialogAddAttribute = true;
  }

  onAddAttributeClick(): void {
    console.log(this.selectNewAttribute);
    console.log(this.newAttributeName);
    let newAttribute = {
      name: this.newAttributeName,
      type: this.selectNewAttribute.data,
    };

    if (
      this.selectNewAttribute.data == 'Checkbox' ||
      this.selectNewAttribute.data == 'Select'
    ) {
      this.onShowDialogAddAttributeEnum();
    }

    this.listAttributes = [...this.listAttributes, newAttribute];
    this.displayDialogAddAttribute = false;
  }

  onShowDialogAddAttributeEnum(): any {
    this.displayDialogAddAttributeEnum = true;
  }

  onAddAttributeEnumClick(): any {
    console.log(this.attributeEnumValue);
    const listAttributes = this.attributeEnumValue.split('#');
    this.listAttributeEnumValues = [...listAttributes];
    this.displayDialogAddAttributeEnum = false;
    return this.handleAttributeAndAttributeEnum();
  }

  handleAttributeAndAttributeEnum(): void {
    console.log(this.newAttributeName);
    console.log(this.listAttributes);
    console.log(this.listAttributeEnumValues);
    this.listAttributes = this.listAttributes.map((value) => {
      if (value.name !== this.newAttributeName) {
        return value;
      }
      if (value.type === 'Input') {
        return {
          name: value.name,
          type: value.type,
        };
      }
      return {
        name: value.name,
        type: value.type,
        enums: this.listAttributeEnumValues.map((value) => {
          return {
            data: value,
            label: value,
          };
        }),

        // this.listAttributeEnumValues
      };
    });

    return this.test();
  }

  test(): void {
    console.log(this.listAttributes);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.file_input = file;
    if (file) {
      this.fileName = file.name;
      // const reader = new FileReader();
      // reader.onload = () => {
      //   this.avatar = reader.result as string;
      //   console.log('Avatar changed:', this.avatar);
      // };

      // reader.readAsDataURL(file);
      console.log(file);
    }
  }


  //================================== handle save

  async handleSaveService(): Promise<number>{
    const service: CreateService = new CreateService(
        this.createServiceForm.controls['name'].value,
        this.createServiceForm.controls['type'].value,
        this.createServiceForm.controls['time_handle'].value,
        this.createServiceForm.controls['department'].value.data,
        this.contentDescription
      );

      let service_id: number = null;
    try {
        const insertService$ = this.serviceService.createService(service);
        const res = await lastValueFrom(insertService$);
        service_id = Number(res.id);
    } catch (error) {
        console.error('Error while creating service:', error);
    }
      return service_id
  }

  async handleSaveSteps(service_id: number){
    
      for (let index = 0; index < this.stepsBox.length; index++) {
        const step:CreateProceduralStep  = new CreateProceduralStep(
          (index+1),
          Number(this.stepsBox[index].data),
          service_id
        );
        this.serviceService.CreateProceduralStep(step).subscribe({
          next: (res) => {

          },
          error: (err) => {}
        });
        
      }
  }

  async handleSaveAttributes(service_id: number){

    for (let index = 0; index < this.listAttributes.length; index++) {
      const attribute:CreateAttribute = new CreateAttribute(
        this.listAttributes[index].name,
        this.listAttributes[index].type,
        service_id
      );

      let attribute_id:number = null;
      const saveAttribute$ = this.serviceService.createAttribute(attribute);
      const res = await lastValueFrom(saveAttribute$);
      attribute_id = Number(res.id);
      try {
        if (this.listAttributes[index]?.enums?.length > 0){
          for (let j = 0; j < this.listAttributes[index].enums.length; j++) {
            const attributeFormEnum: CreateAttributeFormEnum = new CreateAttributeFormEnum(
              this.listAttributes[index].enums[j].label
            );

            this.serviceService.createAttributeEnum(attributeFormEnum,attribute_id).subscribe({
              next: (res) => {

              },
              error: (err) => {}
            })
            
          }
        }
      } catch (error) {
        
      }
      
    }
  }

  async handleSaveFile(): Promise<string>{
      let link = null;
      const res = await this.file2Service.uploadFiles([this.file_input]);
      console.log(res);
      
      if(res.length > 0) link = res[0];

      return link;
  }

  async handleSaveFormFile(linkImg: string,service_id: number, department_id: number){
    const formFile: CreateFormFile = new CreateFormFile(
      linkImg,
      service_id,
      department_id
    );

    this.serviceService.createFormFile(formFile).subscribe({
      next: (res) => {

      },
      error: (err) => {}

    })

  }

  isValidService():boolean{
    if(!this.createServiceForm.valid){
      this.notificationService.toastError('Vui lòng nhập đầy đủ dịch vụ !','Thông báo');
      return false;
    }

    if(this.stepsBox.length <= 0){
      this.notificationService.toastError('Vui lòng chọn các bước thực hiện dịch vụ!','Thông báo');
      return false;
    }

    if(this.listAttributes.length <= 0){
      this.notificationService.toastError('Vui lòng thêm thuộc tính cho dịch vụ!','Thông báo');
      return false;
    }
    

    return true;
  }

  async btnSave(){
    this.loadingService.showLoading();
    console.log(this.createServiceForm);
    console.log(this.stepsBox);
    console.log(this.contentDescription);
    console.log(this.listAttributes);
    console.log(this.file_input);
    
    if(!this.isValidService()) {
      return this.loadingService.hideLoading();
      
    };

    
    // create service
    const service_id:number = await this.handleSaveService();

    // upload file
    const linkImg = await this.handleSaveFile();

    // save attributes
    await this.handleSaveAttributes(service_id);

    // create form file
    await this.handleSaveFormFile(linkImg,service_id,Number(this.createServiceForm.controls['department'].value.data));

    // create proceduralstep
    await this.handleSaveSteps(service_id);

    // CreateAttribute
    setTimeout(() => {
      this.loadingService.hideLoading();
      this.notificationService.toastSuccess('Thêm thành công','Thông báo');
    }, 500);

    
  }



  
}

