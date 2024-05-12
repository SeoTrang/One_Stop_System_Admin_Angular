import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { PageEvent } from './interface/PageEvent.interface';
import {ConfirmationService, MessageService} from 'primeng/api';
import { ServiceService } from '@core/services/service.service';
import { Service } from '@core/models/service';

class City{
  name: string;
  code: string;
}

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ServiceComponent implements OnInit {

  cities!: City[];

    selectedCities!: City[];

    value: string | undefined;

    menuItems: any[] | undefined;

    menuActionService: any[] | undefined;

    services!: Service[];

    firstItems: number = 0;

    rowsItems: number = 10;

    

    constructor(
      private confirmationService: ConfirmationService, 
      private messageService: MessageService,
      private serviceService: ServiceService
    ) {}

  ngOnInit(): void {
    this.cities = [
      {name: 'New York', code: 'NY'},
      {name: 'Rome', code: 'RM'},
      {name: 'London', code: 'LDN'},
      {name: 'Istanbul', code: 'IST'},
      {name: 'Paris', code: 'PRS'}
    ];
    this.menuItems = [
      {
          label: 'In',
          icon: 'pi pi-print',
          command: () => {
            console.log("hello");
            
        },
        styleClass:'menu-print'
      },
      {
          label: 'Nhập',
          icon: 'pi pi-file-import',
          command: () => {
            console.log("hello");
            
        }
      },
      {
        label: 'Xuất',
        icon: 'pi pi-file-export',
        command: () => {
          console.log("hello");
          
      }
      }
    ];

    this.menuActionService = [
      {
          label: 'Xem',
          icon: 'pi pi-eye',
          command: () => {
            console.log("hello");
            
        },
        styleClass:'menu-view'
      },
      {
          label: 'Sửa',
          icon: 'pi pi-pencil',
          command: () => {
            console.log("hello");
            
        },
        styleClass:'menu-edit'
      },
      {
        label: 'Xóa',
        icon: 'pi pi-trash',
        command: ($event) => {
          this.confirmDelete($event);
          
        },
        styleClass:'menu-delete'
      }
    ];

    // this.services = [
    //     {
    //       id: 1,
    //       name: 'Đăng ký nhận giấy chứng nhận sinh viên NCKH',
    //       type: 'online, offline',
    //       department:{
    //         id: 1,
    //         name: 'Phòng tài chính',
    //         address: 'C1-101',
    //         created_at: '10:22 4/3/2024',
    //         updated_at: '10:22 4/3/2024'
    //       },
    //       used: '50',
    //       description: '',
    //       time_handle:'3 ngày',
    //       created_at: '10:22 4/3/2024',
    //       updated_at: '10:22 4/3/2024'
    //     },
    //     {
    //       id: 2,
    //       name: 'Đề nghị cấp phiếu điểm học tập năm học, toàn khóa',
    //       type: 'online',
    //       department:{
    //         id: 1,
    //         name: 'Phòng đào tạo',
    //         address: 'C1-101',
    //         created_at: '10:22 4/3/2024',
    //         updated_at: '10:22 4/3/2024'
    //       },
    //       used: '50',
    //       description: '',
    //       time_handle:'2 ngày',
    //       created_at: '10:22 4/3/2024',
    //       updated_at: '10:22 4/3/2024'
    //     },
       
    // ]
    
    this.onLoadServicedata();
  }


  onLoadServicedata(){
    this.serviceService.getAllServices().subscribe({
      next: (data) => {
        this.services = data;
      },
      error: (err) => {
        console.log(err);
        
      }
    })
  }

  onPageChange(event: PageEvent) {
    this.firstItems = event.first;
    this.rowsItems = event.rows;

    console.log(this.firstItems);
    console.log(this.rowsItems);
    
  }

  onClickItemService(id: any){
    console.log('id: ' + id);
    
  }

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Bạn chắc chắn muốn xóa dịch vụ "Đề nghị cấp phiếu điểm học tập năm học, toàn khóa"?',
        header: '⚠️ Cảnh báo',
        // icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        acceptLabel: 'Xóa',
        rejectLabel: 'Hủy',
        
        rejectIcon:"none",
        acceptButtonStyleClass: 'bg-red-500 text-white',
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
            // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        },
        reject: () => {
            // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });

}

}
