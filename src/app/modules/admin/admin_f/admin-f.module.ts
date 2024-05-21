import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfficerComponent } from './officer/officer.component';
import { AdminFRoutingModule } from './admin-f-routing.module';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { CreateOfficerComponent } from './create-officer/create-officer.component';
import { PasswordModule } from 'primeng/password';
import { TreeSelectModule } from 'primeng/treeselect';
import { CreateStudentComponent } from './create-student/create-student.component';
import { StudentComponent } from './student/student.component';
import { ServiceComponent } from './service/service.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CreateServiceComponent } from './create-service/create-service.component';
import {StepsModule} from 'primeng/steps';
import {DialogModule} from 'primeng/dialog';
import {MatButtonModule} from '@angular/material/button';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { EditorModule } from 'primeng/editor';
import { QuillModule } from 'ngx-quill';
import { DepartmentComponent } from './department/department.component';
import { SharedModule } from '@modules/shared/shared.module';
import { FormAutoComponent } from './form-auto/form-auto.component';
import { CreateFormAutoComponent } from './create-form-auto/create-form-auto.component';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TabMenuModule } from 'primeng/tabmenu';
import { DocumentComponent } from './document/document.component';
import {MatTabsModule} from '@angular/material/tabs';
import { PostComponent } from './post/post.component';
import { CreatePostComponent } from './post/components/create-post/create-post.component';
import { ContentPostComponent } from './post/components/content-post/content-post.component';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { NavPostComponent } from './post/components/nav-post/nav-post.component';
import { RbacComponent } from './RBAC/rbac.component';
import { EditorComponent } from './components/editor/editor.component';
import { ItemPostComponent } from './post/components/item-post/item-post.component';
import { PreviewMediaComponent } from './post/components/create-post/preview-media/preview-media.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DetailServiceComponent } from './detail-service/detail-service.component';
import { DetailDocumentComponent } from './detail-document/detail-document.component';
import { StudentInforComponent } from './components/student-infor/student-infor.component';
import { CheckboxModule } from 'primeng/checkbox';
import { QuestionComponent } from '../common-page/question/question.component';
import { DetailQuestionComponent } from '../common-page/detail-question/detail-question.component';
import { ContainerDetailQuestionComponent } from '../common-page/components/container-detail-question/container-detail-question.component';
import { ImageModule } from 'primeng/image';

@NgModule({
  declarations: [
    OfficerComponent,
    CreateOfficerComponent,
    CreateStudentComponent,
    StudentComponent,
    ServiceComponent,
    CreateServiceComponent,
    DepartmentComponent,
    FormAutoComponent,
    CreateFormAutoComponent,
    DocumentComponent,
    PostComponent,
    CreatePostComponent,
    ContentPostComponent,
    NavPostComponent,
    RbacComponent,
    EditorComponent,
    ItemPostComponent,
    PreviewMediaComponent,
    DetailServiceComponent,
    DetailDocumentComponent,
    StudentInforComponent,
    QuestionComponent,
    DetailQuestionComponent,
    ContainerDetailQuestionComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AdminFRoutingModule,
    TableModule,
    MultiSelectModule,
    MenuModule,
    PanelMenuModule,
    FormsModule,
    InputTextModule,
    PaginatorModule,
    PasswordModule,
    TreeSelectModule,
    ConfirmDialogModule,
    StepsModule,
    DialogModule,
    MatButtonModule,
    DragDropModule,
    EditorModule,
    MatCheckboxModule,
    QuillModule.forRoot(),
    SharedModule,
    TabViewModule,
    TabMenuModule,
    TagModule,
    MatTabsModule,
    InputTextareaModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    ImageModule
  ],
  providers: [
    ConfirmationService
  ]
})
export class AdminFModule { }
