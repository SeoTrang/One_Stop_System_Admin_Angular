export const environment = {
	production  : false ,
	coreName    : 'ovic_core_14' ,
	home_url    : 'https://localhost:8008' ,
	root        : 'https://dev.ictu.vn' ,
	url         : 'https://api-dev.ictu.vn:10091/' ,
	datetime    : 'https://api-dev.ictu.vn:10091/datetime' ,
	googleDrive : 'https://api-dev.ictu.vn:10091/elearning/api/driver/' ,
	// api         : 'http://localhost:3000' ,
	api         : 'https://cd95-2402-800-613e-483d-e096-9d2-a358-d239.ngrok-free.app' ,
	media       : 'https://api-dev.ictu.vn:10091/elearning/api/uploads/' ,
	fileDir     : 'https://media.ictu.edu.vn:9081/folder/elearning/' ,
	download    : 'https://media.ictu.edu.vn:9081/media/elearning/' ,
	ws_url      : 'wss://api-dev.ictu.vn:10092' ,
	ws_path     : '/sso/socket' ,
	getRoute    : route => environment.api + route ,
	routerUrl   : route => environment.url + route
};

const acceptFileType = [
	'application/doc' ,
	'application/ms-doc' ,
	'application/msword' ,
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ,
	'application/vnd.openxmlformats-officedocument.presentationml.presentation' ,
	'application/excel' ,
	'application/vnd.ms-excel' ,
	'application/x-excel' ,
	'application/x-msexcel' ,
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ,
	'application/mspowerpoint' ,
	'application/powerpoint' ,
	'application/vnd.ms-powerpoint' ,
	'application/x-mspowerpoint' ,
	'application/vnd.openxmlformats-officedocument.presentationml.presentation' ,
	'application/pdf' ,
	'application/zip' ,
	'application/x-rar-compressed' ,
	'application/octet-stream' ,
	'application/x-zip-compressed' ,
	'multipart/x-zip' ,
	'audio/mpeg' ,
	'image/jpeg' ,
	'image/png' ,
	'video/mp4' ,
	'text/plain' ,
	'video/quicktime' ,
	'video/x-quicktime' ,
	'image/mov' ,
	'audio/aiff' ,
	'audio/x-midi' ,
	'audio/x-wav' ,
	'video/avi'
];

const appLanguages       = [
	{ name : 'vn' , label : 'Tiếng việt' } ,
	{ name : 'en' , label : 'English' }
];
const appDefaultLanguage = { name : 'vn' , label : 'Tiếng việt' };
const appVersion         = '2.0.1';

export const APP_CONFIGS = {
	defaultRedirect          : '/admin' ,
	pageTitle                : 'Angular core 14' ,
	multiLanguage            : true ,
	defaultLanguage          : appDefaultLanguage , // không được bỏ trống trường này ngay cả khi multiLanguage = false
	languages                : appLanguages ,
	realm                    : 'elearning' , // app realm
	dateStart                : '09/2020' , // 06/2020
	maxUploadSize            : 838860800 , // (1024 * 1024 * 200) = 800mb
	maxFileUploading         : 10 , // The maximum number of files allowed to upload per time
	donvi_id                 : 1 , // default donvi id
	coreVersion              : '2.0.0' ,
	appVersion               : appVersion ,
	pingTime                 : 30 , // unit seconds
	storeLabels              : [ 'Server File' , 'ICTU Drive' ] ,
	metaKeyStore             : '__store_dir' ,
	metaKeyLanguage          : '__language' ,
	showHttpInterceptorError : false ,
	limitFileType            : false ,
	info_console             : true ,
	project_name             : `Core 14 V${ appVersion }` ,
	author                   : 'OvicSoft' ,
	bg_color_01              : '#008060' ,
	bg_color_02              : '#4959bd' ,
	acceptList               : acceptFileType ,
	cloudStorage             : '1mkWmS69qTh_7uoS_wpKDju7OdHLSkA1y' , //driveFolder id
	lectureCloudStorage      : '1Gwx6F72HUgM6ZDxonsvj8zLySGB6AYLJ' ,
	teacherCloudStorage      : '1YZwbEC_OBOTg6OyzvWXMWqxJI63dehH6' ,
	soundAlert               : true
};

/* define menu filter */
export const HIDDEN_MENUS = new Set( [ 'message/notification-details' ] ); // id của menu không muốn hiển thị

// export const CSRF_TOKEN_KEY         = 'CDaJMADt';
// export const CSRF_TOKEN_EXPIRED_KEY = 'MsWAA8EX';

export const USER_KEY      = 'ZpeJk7zV';
export const USER_ROLE_KEY = 'ZpeJk7zV1';
export const USER_ROLE_KEY_INIT = 'ZpeJk7zV2';
export const EXPIRED_KEY   = 'ZY4dcVQ8';
export const UCASE_KEY     = 'S2e6M9AT';
export const ROLES_KEY     = 'xKwPLuJF';
export const META_KEY      = 'MKhGKn9P';
export const ACCESS_TOKEN  = 'Wf5XG74P';
export const REFRESH_TOKEN = 'AbLPDaGK';
export const ENCRYPT_KEY   = 'W4jM2P5r';
export const APP_STORES    = '4QfWtr6Z'; // no clear after logout
