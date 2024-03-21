import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateDepartment, DepartmentDetail, UpdateDepartment } from '@core/models/department';
import { Menu } from '@core/models/menu';
import { DepartmentService } from '@core/services/deparment.service';
import { LoadingService } from '@core/services/loading.service';
import { NavMenuService } from '@core/services/navMenu.service';
import { NotificationService } from '@core/services/notification.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
})
export class DepartmentComponent implements OnInit {
  visible: boolean;
  editDepartmentVisible: boolean;

  departments!: DepartmentDetail[];

  menuItems: MenuItem[] = [];

  departmentSelected: any;

  newDepartmentValue: CreateDepartment;
  departmentForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
  });

  editDepartmentForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
  });;

  

  constructor(
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private loadingService: LoadingService,
    private navMenuService: NavMenuService,
    private confirmationService: ConfirmationService
  ) {
    this.onLoadData();
  }

  ngOnInit(): void {
    this.visible = false;
    this.editDepartmentVisible = false;
    this.navMenuService.getMenu().subscribe((menu: Menu[]) => {
      console.log(menu); // In ra dữ liệu menu
      for (let index = 0; index < menu.length; index++) {
        if (menu[index].label === 'Sửa phòng ban') {
          this.menuItems = [
            ...this.menuItems,
            {
              label: 'Sửa',
              icon: 'pi pi-refresh',
              styleClass: 'menu-edit',
              command: ()=>{
                this.updateMenuClick();
              },
            },
          ];
        }

        if (menu[index].label === 'Xóa phòng ban') {
          this.menuItems = [
            ...this.menuItems,
            {
              label: 'Xóa',
              icon: 'pi pi-times',
              styleClass: 'menu-delete',
              command: () => {
                this.confirmDelete();
              },
            },
          ];
        }
      }

      console.log(this.menuItems);
    });
  }

  onInitMenuItems(): void {}

  onLoadData(): void {
    this.loadingService.showLoading();
    this.departmentService.getAllDepartmentsDetail().subscribe({
      next: (res) => {
        this.departments = res;
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, 500);
        console.log(res);
      },
      error: (err) => {
        console.log(err);
        this.loadingService.hideLoading();
        this.notificationService.toastError(
          'Lấy dữ liệu thất bại',
          'Thông báo'
        );
      },
    });
  }

  showDialog() {
    this.visible = true;
  }

  btnAddNewDepartment(): void {
    if (!this.departmentForm.valid) {
      this.notificationService.toastError(
        'Vui lòng nhập đầy đủ thông tin !',
        'Error'
      );
    }
    this.loadingService.showLoading();
    const newDepartment: CreateDepartment = {
      name: this.departmentForm.controls['name'].value,
      address: this.departmentForm.controls['address'].value,
    };

    this.departmentService.addNewDepartment(newDepartment).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.loadingService.hideLoading();
          this.visible = false;
          this.notificationService.toastSuccess(
            'Thêm thành công!',
            'Thông báo'
          );
          this.departmentForm.reset();
          this.onLoadData();
        }, 500);
        console.log(res);
      },
      error: (err) => {
        console.log(err);
        this.notificationService.toastError('Thêm thất bại!', 'Thông báo');
      },
    });
  }

  confirmDelete(event?: Event) {
    this.confirmationService.confirm({
      // target: event.target as EventTarget,
      message: `Bạn chắc chắn muốn xóa '${this.departmentSelected.name}' ?`,
      header: 'Cảnh báo ⚠️',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.loadingService.showLoading();
        this.departmentService.deleteDepartment(Number(this.departmentSelected.id)).subscribe({
          next: (res) => {
            setTimeout(() => {
              this.loadingService.hideLoading();
              this.notificationService.toastSuccess('Xóa thành công!','Thông báo')
              this.onLoadData();
            }, 500);
          },
          error: (err) => {
            
          }
        })

      },
      reject: () => {},
    });
  }

  updateDepartmentSelected(department:any){
    this.departmentSelected = department;
    // Gán giá trị của departmentSelected vào editDepartmentForm
    this.editDepartmentForm.patchValue({
      name: this.departmentSelected.name,
      address: this.departmentSelected.address,
    });
    
  }

  updateMenuClick():void{ //khi menu được click thì show box sửa và gắn giá trị
    this.editDepartmentVisible = true;
    console.log(this.editDepartmentForm.controls['name'].value);
    
  }

  btnUpdateOnclick():void{
    if (!this.editDepartmentForm.valid) {
      this.notificationService.toastError(
        'Vui lòng nhập đầy đủ thông tin !',
        'Error'
      );
      return;
    }
    this.loadingService.showLoading();
    const newDepartment: UpdateDepartment = {
      name: this.editDepartmentForm.controls['name'].value,
      address: this.editDepartmentForm.controls['address'].value,
    };

    this.departmentService.updateDepartment(Number(this.departmentSelected.id),newDepartment).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.loadingService.hideLoading();
          this.visible = false;
          this.notificationService.toastSuccess(
            'Sửa thành công!',
            'Thông báo'
          );
          this.departmentForm.reset();
          this.onLoadData();
          this.editDepartmentVisible = false;
        }, 500);
        console.log(res);
      },
      error: (err) => {
        console.log(err);
        this.notificationService.toastError('Sửa thất bại!', 'Thông báo');
      },
    });
  }
}
