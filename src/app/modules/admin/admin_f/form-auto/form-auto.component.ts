import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

class City{
  name: string;
  code: string;
}

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

interface Service {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface File{
  id: number;
  name: string;
  type: string;
  size: string;
  service: Service;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-form-auto',
  templateUrl: './form-auto.component.html',
  styleUrls: ['./form-auto.component.css']
})
export class FormAutoComponent implements OnInit {

  cities!: City[];

  selectedCities!: City[];

  firstItems: number = 0;

  rowsItems: number = 10;

  files!: File[];

  menuItems: any[] | undefined;

  value: string | undefined;

  menuActionService: any[] | undefined;

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) { }

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
      },
      {
          label: 'Nhập',
          icon: 'pi pi-file-import'
      },
      {
        label: 'Xuất',
        icon: 'pi pi-file-export'
      }
    ];
    this.files = [
        {
          id: 1,
          name: 'avatar_13.jpg',
          type: 'image/jpeg',
          size: '45.78 Mb',
          service:{
            id: 1,
            name: 'Phòng tài chính',
            created_at: '10:22 4/3/2024',
            updated_at: '10:22 4/3/2024'
          },
          created_at: '10:22 4/3/2024',
          updated_at: '10:22 4/3/2024'
        },
        {
          id: 1,
          name: 'avatar_13.jpg',
          type: 'image/jpeg',
          size: '45.78 Mb',
          service:{
            id: 1,
            name: 'Phòng tài chính',
            created_at: '10:22 4/3/2024',
            updated_at: '10:22 4/3/2024'
          },
          created_at: '10:22 4/3/2024',
          updated_at: '10:22 4/3/2024'
        },
        {
          id: 1,
          name: 'avatar_13.jpg',
          type: 'image/jpeg',
          size: '45.78 Mb',
          service:{
            id: 1,
            name: 'Phòng tài chính',
            created_at: '10:22 4/3/2024',
            updated_at: '10:22 4/3/2024'
          },
          created_at: '10:22 4/3/2024',
          updated_at: '10:22 4/3/2024'
        },
        
    ]

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
  }

  onPageChange(event: PageEvent) {
    this.firstItems = event.first;
    this.rowsItems = event.rows;

    console.log(this.firstItems);
    console.log(this.rowsItems);
    
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
