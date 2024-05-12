import { User } from '@core/models/user';
import { Ucase } from '@core/models/ucase';
import { Officer } from '@modules/admin/admin_f/officer/interface/officer.interface';

export interface Auth {
	expires : string;
	session_id : string;
	user : Officer;
}

export interface Token {
	access_token : string;
	refresh_token : string;
}

export interface Permission {
	menus : Ucase[];
	roles : string[]; // list role name
}

export interface UserSignIn {
	identifier : string,
	password : string,
}

export interface GoogleSignIn {
	id : string;
	email : string;
	idToken : string;
	provider : string; //'GOOGLE'
}
