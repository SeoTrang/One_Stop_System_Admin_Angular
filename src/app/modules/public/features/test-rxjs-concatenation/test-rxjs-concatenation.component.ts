import { Component , OnInit } from '@angular/core';
import { concat , concatMap , interval , of , merge , takeWhile , mergeMap  } from 'rxjs';
import { map  } from 'rxjs/operators';

@Component( {
	selector    : 'app-test-rxjs-concatenation' ,
	templateUrl : './test-rxjs-concatenation.component.html' ,
	styleUrls   : [ './test-rxjs-concatenation.component.css' ]
} )
export class TestRxjsConcatenationComponent implements OnInit {

	constructor() { }

	ngOnInit() : void {
	}

	testConcat() {
		console.log( '---------------testConcat------------------' );
		const series1$ = interval( 1000 ).pipe( map( val => 's1:' + ( val * 10 ).toString( 10 ) ) , takeWhile( v => parseInt( v.replace( 's1:' , '' ) , 10 ) <= 50 ) );
		const series2$ = interval( 1000 ).pipe( map( val => 's2:' + ( val * 100 ).toString( 10 ) ) , takeWhile( v => parseInt( v.replace( 's2:' , '' ) , 10 ) <= 1000 ) );
		const result$  = concat( series1$ , series2$ );
		result$.subscribe( console.log );
	}

	testMap() {
		console.log( '---------------testMap------------------' );
		const ob$ = of( 'ob#1' , 'ob#2' , 'ob#3' , 'ob#4' , 'ob#5' );
		ob$.pipe( map( value => value + ' : emitted' ) ).subscribe( console.log );
	}

	testConcatMap() {
		console.log( '---------------testConcatMap------------------' );
		const ob$ = of( 'ob#1' , 'ob#2' , 'ob#3' , 'ob#4' , 'ob#5' );
		ob$.pipe( concatMap( value => of( value + ' : emitted' ) ) ).subscribe( console.log );
	}

	testMerge() {
		console.log( '---------------testMerge------------------' );
		const series1$ = interval( 1000 ).pipe( map( val => 's1:' + ( val * 10 ).toString( 10 ) ) , takeWhile( v => parseInt( v.replace( 's1:' , '' ) , 10 ) <= 50 ) );
		const series2$ = interval( 1000 ).pipe( map( val => 's2:' + ( val * 100 ).toString( 10 ) ) , takeWhile( v => parseInt( v.replace( 's2:' , '' ) , 10 ) <= 1000 ) );
		const result$  = merge( series1$ , series2$ );

		result$.subscribe( console.log );
	}

	testMergeMap() {
		console.log( '---------------testMergeMap------------------' );
		const series1$ = interval( 1000 ).pipe( map( val => 's1:' + ( val * 10 ).toString( 10 ) ) , takeWhile( v => parseInt( v.replace( 's1:' , '' ) , 10 ) <= 50 ) );
		const series2$ = interval( 1000 ).pipe( map( val => 's2:' + ( val * 100 ).toString( 10 ) ) , takeWhile( v => parseInt( v.replace( 's2:' , '' ) , 10 ) <= 1000 ) );
		const result$  = merge( series1$ , series2$ );
		result$.pipe( mergeMap( value => of( value + ' : emitted' ) ) ).subscribe( console.log );
	}
}
