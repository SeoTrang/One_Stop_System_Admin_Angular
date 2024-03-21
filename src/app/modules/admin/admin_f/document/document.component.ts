import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

class City{
  name: string;
  code: string;
}

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
  // encapsulation: ViewEncapsulation.None,
})
export class DocumentComponent implements OnInit {
  products!: any[];
  menuItems: any[] | undefined;
  cities!: City[];
  selectedCities!: City[];
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

    this.products = [
      {
        id: 123,
        avatar: 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_15.jpg',
        name: "Tráng",
        service: 'Đơn đề nghị thôi học',
        class: "KTPM K18A",
        department: "Phòng đào tạo",
        updated_at: "13/03/2024",
        status: "pedding"
      },
      {
        id: 123,
        avatar: 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_15.jpg',
        name: "Tráng",
        service: 'Đơn đề nghị thôi học',
        class: "KTPM K18A",
        department: "Phòng đào tạo",
        updated_at: "13/03/2024",
        status: "success"
      },
      {
        id: 123,
        avatar: 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_15.jpg',
        service: 'Đơn đề nghị thôi học',
        name: "Tráng",
        class: "KTPM K18A",
        department: "Phòng đào tạo",
        updated_at: "13/03/2024",
        status: "canceled"
      },
      
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
          label: 'Xác nhận',
          icon: 'pi pi-pencil',
          command: () => {
            console.log("hello");
            
        },
        styleClass:'menu-edit'
      },
      {
        label: 'Hủy',
        icon: 'pi pi-trash',
        command: ($event) => {
          this.confirmDelete($event);
          
        },
        styleClass:'menu-delete'
      }
    ];
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
