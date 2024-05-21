import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Document } from '@core/models/document';
import { Service } from '@core/models/service';
import { Student } from '@core/models/student';
import { DocumentActivityTraceService } from '@core/services/document-activity-trace.service';
import { DocumenttService } from '@core/services/document.service';
import { LoadingService } from '@core/services/loading.service';
import { NotificationService } from '@core/services/notification.service';
import { ServiceService } from '@core/services/service.service';
import { StudentService } from '@core/services/student.service';

@Component({
  selector: 'app-detail-document',
  templateUrl: './detail-document.component.html',
  styleUrls: ['./detail-document.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailDocumentComponent implements OnInit {

    document: Document;
    service: any;
    attributeValues: any = {};
    selectedCheckboxValues: any[] = [];
    document_id?: number;
    student: Student;
    documentActivityTrace: any;
  constructor(
    public sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private loadingService: LoadingService,
    private documentService: DocumenttService,
    private notificationService: NotificationService,
    private studentService: StudentService,
    private documentActivityTraceService: DocumentActivityTraceService
  ) { }

  ngOnInit(): void {
    const documentId = this.route.snapshot.params['document_id'];
    console.log(documentId);
    this.document_id = Number(documentId)

    this.onLoadData();

  }

  onLoadData(){
    this.documentService.getById(Number(this.document_id)).subscribe({
      next: (data) => {
          console.log(data);
          this.document = data;
          this.handleSetValueToAttributeValue();
          this.onLoadServiceData(data.service.id);
      },

      error: (err) => {
          console.log(err);
          
      }
    })
    this.onLoadDocumentActivityTrace();
    
  }

  onLoadServiceData(service_id: number){
    this.serviceService.getOneById(Number(service_id)).subscribe({
      next: (data) => {
          console.log(data);
          data.attributeFormServices.forEach(attribute => {
            if (attribute.type === 'Checkbox') {
              attribute.attributeFormEnums.forEach(option => {
                if (option.checked === undefined || option.checked === null) {
                  if(this.selectedCheckboxValues.includes(option.id)) option.checked = true;
                  else option.checked = false;
                }
              });
            }
          });
          console.log(data);
          
          this.service = data;
          
      },

      error: (err) => {
          console.log(err);
          
      }
  })
  }

  onLoadDocumentActivityTrace(){
    this.documentActivityTraceService.getDocumentActivityTraceByDocId(this.document_id).subscribe({
      next: (data) => {
        this.documentActivityTrace = data;
      },
      error: (err) => {
        console.log(err);
        
      }
    })
  }


  handleSetValueToAttributeValue(){
    this.document.attributeValues.forEach(attrValue => {
      if (attrValue.attributeFormService.type === 'Checkbox') {
        this.selectedCheckboxValues.push(attrValue.enum.id);
      } else {
        this.attributeValues[attrValue.attributeFormService.id] = attrValue.value;
      }
    });

    console.log(this.attributeValues);
    
  }

  // Hàm để xử lý sự kiện input và cập nhật giá trị
  handleInput(event: any, attributeId: number): void {
    if (event.target instanceof HTMLInputElement) {
      this.updateAttributeValue(attributeId, event.target.value);
    }
  }
  // Hàm để cập nhật giá trị thuộc tính
  updateAttributeValue(attributeId: number, value: any): void {
    this.attributeValues[attributeId] = value;
  }



  // Hàm để xử lý sự kiện khi checkbox được chọn hoặc bỏ chọn
  handleCheckboxChange(event: any, attributeId: number, enumId: number): void {
    console.log(enumId);
    console.log(event);
    
    if (event.checked) {

        console.log('check :');
        
        console.log(enumId);
        
      // Nếu checkbox được chọn, thêm giá trị vào mảng selectedCheckboxValues
      this.selectedCheckboxValues.push(enumId);
    } else {
      // Nếu checkbox bị bỏ chọn, loại bỏ giá trị khỏi mảng selectedCheckboxValues
      const index = this.selectedCheckboxValues.indexOf(enumId);
      if (index !== -1) {
        this.selectedCheckboxValues.splice(index, 1);
      }
    }
  }
}
