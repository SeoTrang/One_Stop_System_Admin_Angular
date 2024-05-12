import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DocumenttService } from '@core/services/document.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { UpdateDocumentDto } from '@core/models/document';
import { NotificationService } from '@core/services/notification.service';
import { LoadingService } from '@core/services/loading.service';
import { AuthService } from '@core/services/auth.service';
import { Officer } from '../officer/interface/officer.interface';
class City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
  // encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentComponent implements OnInit {
  products!: any[];
  menuItems: any[] | undefined;
  cities!: City[];
  selectedCities!: City[];
  value: string | undefined;
  menuActionService: any[] | undefined;
  documnets?: any[];
  api?: any;
  document_id_clicked?: number;
  visible_dialog_last_department: boolean = false;
  visible_dialog_cancled: boolean = false;
  description_document: string = '';
  checkServiceIsSuccess: boolean = false;
  checkServiceCancled: boolean = false;
  updateDocumentDto: UpdateDocumentDto;
  officer: Officer;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private documentService: DocumenttService,
    private notificationService: NotificationService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.officer = this.authService.getUserInfo();
    this.api = environment.api;
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];
    this.menuItems = [
      {
        label: 'In',
        icon: 'pi pi-print',
      },
      {
        label: 'Nhập',
        icon: 'pi pi-file-import',
      },
      {
        label: 'Xuất',
        icon: 'pi pi-file-export',
      },
    ];

    // this.products = [
    //   {
    //     id: 123,
    //     avatar: 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_15.jpg',
    //     name: "Tráng",
    //     service: 'Đơn đề nghị thôi học',
    //     class: "KTPM K18A",
    //     department: "Phòng đào tạo",
    //     updated_at: "13/03/2024",
    //     status: "pedding"
    //   },
    //   {
    //     id: 123,
    //     avatar: 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_15.jpg',
    //     name: "Tráng",
    //     service: 'Đơn đề nghị thôi học',
    //     class: "KTPM K18A",
    //     department: "Phòng đào tạo",
    //     updated_at: "13/03/2024",
    //     status: "success"
    //   },
    //   {
    //     id: 123,
    //     avatar: 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_15.jpg',
    //     service: 'Đơn đề nghị thôi học',
    //     name: "Tráng",
    //     class: "KTPM K18A",
    //     department: "Phòng đào tạo",
    //     updated_at: "13/03/2024",
    //     status: "canceled"
    //   },

    // ];

    this.onLoadMenuActionService();
    this.onloadData();
  }

  onloadData() {
    this.documentService.getAll().subscribe({
      next: (data) => {
        this.documnets = data;
        console.log(data);
        this.loadingService.showLoading();
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, 500);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  handleCheckIsSucces(): boolean {
    let document = null;
    for (let index = 0; index < this.documnets.length; index++) {
      console.log(index);
      console.log(this.documnets);

      console.log(this.document_id_clicked);

      if (this.document_id_clicked == this.documnets[index].id) {
        document = this.documnets[index];
        break;
      }
    }
    console.log(document);

    if (document.status == 2) {
      return (this.checkServiceIsSuccess = true);
    }
    return (this.checkServiceIsSuccess = false);
  }
  handleCheckIsCancled(): boolean {
    let document = null;
    for (let index = 0; index < this.documnets.length; index++) {
      console.log(index);
      console.log(this.documnets);

      console.log(this.document_id_clicked);

      if (this.document_id_clicked == this.documnets[index].id) {
        document = this.documnets[index];
        break;
      }
    }
    console.log(document);

    if (document.status == 0) {
      return (this.checkServiceCancled = true);
    }
    return (this.checkServiceCancled = false);
  }
  onLoadMenuActionService() {
    this.menuActionService = [
      {
        label: 'Xem',
        icon: 'pi pi-eye',

        command: () => {
          console.log('hello');
        },
        styleClass: 'menu-view',
      },
      {
        label: 'Xác nhận',
        icon: 'pi pi-pencil',
        disabled: this.checkServiceIsSuccess || this.checkServiceCancled,
        command: ($event) => {
          let document = null;
          for (let index = 0; index < this.documnets.length; index++) {
            if (this.document_id_clicked == this.documnets[index].id) {
              document = this.documnets[index];
              break;
            }
          }

          if (document.is_last_step) {
            this.visible_dialog_last_department = true;
          } else {
            this.updateDocumentDto = new UpdateDocumentDto(
              'confirm',
              Number(document.service.id),
              ''
            );

            this.documentService
              .updateDocumentStatus(
                Number(this.document_id_clicked),
                this.updateDocumentDto
              )
              .subscribe({
                next: (data) => {
                  this.notificationService.toastSuccess('Đã xác nhận thủ tục');
                  this.onloadData();
                },
                error: (err) => {
                  this.notificationService.toastError(
                    'Xác nhận thủ tục thất bại'
                  );
                },
              });
          }
        },
        styleClass: 'menu-edit',
      },
      {
        label: 'Hủy',
        icon: 'pi pi-trash',
        disabled: this.checkServiceIsSuccess || this.checkServiceCancled,
        command: ($event) => {
          this.visible_dialog_cancled = true;
        },
        styleClass: 'menu-delete',
      },
    ];
  }

  onClickItemService(id: any) {
    console.log('id: ' + id);
    this.document_id_clicked = Number(id);
    this.handleCheckIsSucces();
    this.handleCheckIsCancled();
    this.onLoadMenuActionService();
  }

  // kiểm tra nếu chưa có cán bộ giảng nào tiếp nhận thủ tục này hoặc thủ tục đã bị từ chối tiếp nhận
  checkIfReceived(document: any): boolean {
    console.log(document);
    
    let result: boolean = false;
    if (document.documentActivityTraces.length <= 0) {
      
      return false;
    } else {
      for (
        let index = 0;
        index < document.documentActivityTraces.length;
        index++
      ) {
        if (document.documentActivityTraces[index].status == 'resolve' && document.documentActivityTraces[index].proceduralStep.department.id == this.officer.department.id) {
          
          // console.log(document);
          
          result = true;
          break;
        }
      }
      return result;
    }
  }

  // kiểm tra xem có phải tôi là người tiếp nhận thủ tục không. nếu là tôi thì hiển thị ra menu để xử lí thủ tục
  checkIsMeReceived(document: any): boolean {
    let result: boolean = false;
    if (document.documentActivityTraces.length <= 0) {
      return false;
    } else {
      for (
        let index = 0;
        index < document.documentActivityTraces.length;
        index++
      ) {
        if (
          document.documentActivityTraces[index].status == 'resolve' &&
          document.documentActivityTraces[index].officer.id == this.officer.id
        ) {
          console.log('hello');
          
          result = true;
        }
      }
      return result;
    }
  }

  handleReceivedDocument(document:any){
    let data =  {
      officerId : this.officer.id,
      documentId : document.id,
      proceduralStepId : document.proceduralStep.id,
      status: 'resolve'
    }

    this.documentService.handleCreateDocumentActivityTrace(data).subscribe({
      next: (data)=> {
        this.onloadData();
      },
      error: (err) => {
        console.log(err);
        
      }
    })
    
  }

  handleAccepted_dialog_last_department() {
    if (this.description_document) {
      let document = null;
      for (let index = 0; index < this.documnets.length; index++) {
        if (this.document_id_clicked == this.documnets[index].id) {
          document = this.documnets[index];
          break;
        }
      }
      this.updateDocumentDto = new UpdateDocumentDto(
        'confirm',
        Number(document.service.id),
        this.description_document
      );

      this.documentService
        .updateDocumentStatus(
          Number(this.document_id_clicked),
          this.updateDocumentDto
        )
        .subscribe({
          next: (data) => {
            this.notificationService.toastSuccess('Đã xác nhận thủ tục');
            this.onloadData();
          },
          error: (err) => {
            this.notificationService.toastError('Xác nhận thủ tục thất bại');
          },
        });
      return (this.visible_dialog_last_department = false);
    }

    return this.notificationService.toastError(
      'Vui lòng điền thông tin mô tả',
      'Thông báo!'
    );
  }

  
  handleAccepted_dialog_cancled() {
    if (this.description_document) {
      let document = null;
      for (let index = 0; index < this.documnets.length; index++) {
        if (this.document_id_clicked == this.documnets[index].id) {
          document = this.documnets[index];
          break;
        }
      }
      this.updateDocumentDto = new UpdateDocumentDto(
        'cancel',
        Number(document.service.id),
        this.description_document
      );

      this.documentService
        .updateDocumentStatus(
          Number(this.document_id_clicked),
          this.updateDocumentDto
        )
        .subscribe({
          next: (data) => {
            this.notificationService.toastSuccess('Đã xác nhận thủ tục');
            this.onloadData();
          },
          error: (err) => {
            this.notificationService.toastError('Xác nhận thủ tục thất bại');
          },
        });
      return (this.visible_dialog_cancled = false);
    }

    return this.notificationService.toastError(
      'Vui lòng điền thông tin mô tả',
      'Thông báo!'
    );
  }

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        'Bạn chắc chắn muốn hủy dịch vụ "Đề nghị cấp phiếu điểm học tập năm học, toàn khóa"?',
      header: '⚠️ Cảnh báo',
      // icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',

      rejectIcon: 'none',
      acceptButtonStyleClass: 'bg-red-500 text-white',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      },
    });
  }
}
