import { Injectable } from '@angular/core';
import { environment } from '@env';
import { HttpClient , HttpParams } from '@angular/common/http';
import { Observable , of , retry } from 'rxjs';
import { Dto } from '@core/models/dto';
import { map } from 'rxjs/operators';
import { Ucase } from '@core/models/ucase';

@Injectable( {
	providedIn : 'root'
} )
export class UcaseService {

	private readonly api = environment.getRoute( 'ucases/' );

	constructor( private http : HttpClient ) { }

	getUcases( ucaseIds : string , pluck = '' ) : Observable<Ucase[]> {
		const params = pluck ? new HttpParams().set( 'pluck' , pluck ) : new HttpParams().set( 'pluck' , 'id,title,parent_id,route,icon,ordering,position' );
		return ucaseIds ? this.http.get<Dto>( this.api.concat( ucaseIds ) , { params } ).pipe( map( res => res.data ) ) : of( [] );
	}
}
