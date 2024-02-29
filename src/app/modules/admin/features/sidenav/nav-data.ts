export interface NavbarData {
	routeLink : string,
	icon : string,
	label : string;
	state? : 'expanded' | 'collapse';
	children? : NavbarData[];
}

export const navbarData : NavbarData[] = [
	{
		routeLink : 'dashboard' ,
		icon      : 'fa fa-home' ,
		label     : 'Dashboard'
	} ,
	{
		routeLink : 'content-none' ,
		icon      : 'fa fa-camera' ,
		label     : 'Content none'
	} ,
	{
		routeLink : '' ,
		icon      : 'fa fa-cog' ,
		label     : 'Hệ thống' ,
		state     : 'collapse' ,
		children  : [
			{
				routeLink : 'he-thong/thong-tin-he-thong' ,
				icon      : 'fa fa-angle-right' ,
				label     : 'Thông tin'
			} ,
			{
				routeLink : 'he-thong/quan-ly-tai-khoan' ,
				icon      : 'fa fa-angle-right' ,
				label     : 'Tài khoản'
			} ,
			{
				routeLink : 'he-thong/quan-ly-nhom-quyen' ,
				icon      : 'fa fa-angle-right' ,
				label     : 'Nhóm quyền'
			} ,
			{
				routeLink : 'he-thong/thong-tin-tai-khoan' ,
				icon      : 'fa fa-angle-right' ,
				label     : 'My account'
			}
		]
	}

];
