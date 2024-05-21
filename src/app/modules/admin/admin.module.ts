import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';

import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { SidenavComponent } from '@modules/admin/features/sidenav/sidenav.component';
import { NgApexchartsModule } from 'ng-apexcharts';

import { SharedModule } from '@shared/shared.module';
import { ContentNoneComponent } from '@modules/admin/features/content-none/content-none.component';
import { HomeComponent } from '@modules/admin/features/home/home.component';
import { DashboardComponent } from '@modules/admin/dashboard/dashboard.component';
import { UserInfoComponent } from '@modules/admin/dashboard/user-info/user-info.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuLanguageComponent } from '@modules/admin/dashboard/menu-language/menu-language.component';
import { OvicSvgModule } from '@modules/ovic-svg/ovic-svg.module';
import { TranslateModule } from '@ngx-translate/core';
import { OvicMessageModule } from '@modules/admin/features/ovic-message/ovic-message.module';
import { NewHomeComponent } from '@modules/admin/features/new-home/new-home.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
// import { OfficerComponent } from './admin_f/officer/officer.component';
// import { StudentComponent } from './admin_f/student/student.component';
import { ServiceComponent } from './admin_f/service/service.component';
// import { DepartmentComponent } from './admin_f/department/department.component';
// import { FormAutoComponent } from './admin_f/form-auto/form-auto.component';
// import { DocumentComponent } from './admin_f/document/document.component';
import { PostComponent } from './common-page/post/post.component';
// import { QuestionComponent } from './common-page/question/question.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
// import { ContainerDetailQuestionComponent } from './common-page/components/container-detail-question/container-detail-question.component';
// import { DetailQuestionComponent } from './common-page/detail-question/detail-question.component';

@NgModule( {
	declarations : [
		DashboardComponent ,
		ContentNoneComponent ,
		HomeComponent ,
		SidenavComponent ,
		UserInfoComponent ,
		MenuLanguageComponent ,
		NewHomeComponent,
		// OfficerComponent,
		// StudentComponent,
		// ServiceComponent,
		// DepartmentComponent,
		// FormAutoComponent,
		// DocumentComponent,
		PostComponent,
  
	] ,
	imports      : [
		CommonModule ,
		AdminRoutingModule ,
		MenuModule ,
		PanelMenuModule ,
		MessagesModule ,
		MessageModule ,
		ScrollPanelModule ,
		ButtonModule ,
		RippleModule ,
		InputTextModule ,
		NgApexchartsModule ,
		SharedModule ,
		OverlayPanelModule ,
		OvicSvgModule ,
		TranslateModule ,
		OvicMessageModule ,
		DropdownModule ,
		FormsModule,
		MultiSelectModule,
		TableModule
	]
} )
export class AdminModule {}
