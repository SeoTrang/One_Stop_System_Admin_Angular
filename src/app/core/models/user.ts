export interface User {
	id : number;
	name : string;
	identifier : string;
	email : string;
	phone: string;
	display_name: string;
	password? : string;
	avatar? : string;
	status : number;
	created_at : string;
	updated_at : string;
	isAdmin? : number;
	type_user: string;
	in_class?: string;
	department?: string;

}

export interface SimpleUser {
	id : number;
	username : string;
	display_name : string;
	phone : string;
	email : string;
	avatar : string;
	donvi_id : number;
	role_ids : number[];
	donvi_ids : number[] | null,
	status : number;
	created_at : string;
	updated_at : string;
}

export interface UserMeta {
	id? : number;
	user_id : number;
	meta_key : string;
	meta_title : string;
	meta_value : string;
}
