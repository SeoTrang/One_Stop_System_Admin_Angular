import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficerComponent } from './officer/officer.component';
import { CreateOfficerComponent } from './create-officer/create-officer.component';
import { CreateStudentComponent } from './create-student/create-student.component';
import { StudentComponent } from './student/student.component';
import { ServiceComponent } from './service/service.component';
import { CreateServiceComponent } from './create-service/create-service.component';
import { DepartmentComponent } from './department/department.component';
import { FormAutoComponent } from './form-auto/form-auto.component';
import { CreateFormAutoComponent } from './create-form-auto/create-form-auto.component';
import { DocumentComponent } from './document/document.component';
import { PostComponent } from './post/post.component';
import { RbacComponent } from './RBAC/rbac.component';
import { DetailServiceComponent } from './detail-service/detail-service.component';
import { DetailDocumentComponent } from './detail-document/detail-document.component';
import { QuestionComponent } from '../common-page/question/question.component';
import { DetailQuestionComponent } from '../common-page/detail-question/detail-question.component';

const routes: Routes = [
  {
    path: 'officer',
    component: OfficerComponent
  
  },
  {
    path: 'create-officer',
    component: CreateOfficerComponent
  },
  {
    path: 'student',
    component: StudentComponent
  }
  ,
  {
    path: 'create-student',
    component: CreateStudentComponent
  }
  ,
  {
    path: 'service',
    component: ServiceComponent
  },
  {
    path: 'create-service',
    component: CreateServiceComponent
  },
  {
    path: 'department',
    component: DepartmentComponent
  },
  {
    path: 'auto-form',
    component: FormAutoComponent
  },
  {
    path: 'create-auto-form',
    component: CreateFormAutoComponent
  },
  {
    path: 'document',
    component: DocumentComponent
  },
  {
    path: 'post',
    component: PostComponent
  },
  {
    path: 'rbac/:officer_id',
    component: RbacComponent
  },
  {
    path: 'detail-service/:service_id',
    component: DetailServiceComponent
  },
  {
    path: 'detail-document/:document_id',
    component: DetailDocumentComponent
  },
  {
    path: 'question',
    component: QuestionComponent
  },
  {
    path: 'detail-question/:conversation_id',
    component: DetailQuestionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminFRoutingModule { }
