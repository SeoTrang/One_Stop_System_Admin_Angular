import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';
import { ShowCaseComponent } from './show-case/show-case.component';
import { AreaChartsComponent } from './area-charts/area-charts.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { LoaderComponent } from './loader/loader.component';
import { ColorPanelComponent } from '@modules/public/features/ui-components/color-panel/color-panel.component';

const routes : Routes = [
	{
		path      : 'show-case' ,
		component : ShowCaseComponent
	} ,
	{
		path      : 'area-charts' ,
		component : AreaChartsComponent
	} ,
	{
		path      : 'buttons' ,
		component : ButtonsComponent
	} ,
	{
		path      : 'loading' ,
		component : LoaderComponent
	} ,
	{
		path      : 'color-panel' ,
		component : ColorPanelComponent
	} ,
	{
		path       : '**' ,
		redirectTo : 'show-case' ,
		pathMatch  : 'prefix'
	}
];

@NgModule( {
	imports : [ RouterModule.forChild( routes ) ] ,
	exports : [ RouterModule ]
} )
export class UiComponentsRoutingModule {}
