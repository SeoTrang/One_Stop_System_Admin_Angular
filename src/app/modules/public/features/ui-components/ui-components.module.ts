import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiComponentsRoutingModule } from './ui-components-routing.module';
import { AreaChartBasicComponent } from './area-chart-basic/area-chart-basic.component';
import { AreaChartsComponent } from './area-charts/area-charts.component';
import { ShowCaseComponent } from './show-case/show-case.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ButtonsComponent } from './buttons/buttons.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { OvicSvgModule } from '@modules/ovic-svg/ovic-svg.module';
import { LoaderComponent } from './loader/loader.component';
import { SharedModule } from '@shared/shared.module';
import { ColorPanelComponent } from './color-panel/color-panel.component';

@NgModule( {
	declarations : [
		AreaChartBasicComponent ,
		AreaChartsComponent ,
		ShowCaseComponent ,
		ButtonsComponent ,
		LoaderComponent,
  ColorPanelComponent
	] ,
	imports      : [
		CommonModule ,
		UiComponentsRoutingModule ,
		NgApexchartsModule ,
		ButtonModule ,
		RippleModule ,
		ConfirmPopupModule ,
		DialogModule ,
		SidebarModule ,
		TooltipModule ,
		OvicSvgModule ,
		SharedModule
	] ,
	exports      : [
		ButtonsComponent
	] ,
	providers    : [
		ConfirmationService
	]
} )
export class UiComponentsModule {}
