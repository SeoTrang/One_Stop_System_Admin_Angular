import { Pipe , PipeTransform } from '@angular/core';
import { OvicDriveFile , OvicFileSever , OvicFileStore  } from '@core/models/file';
import { FileService } from '@core/services/file.service';

@Pipe( {
	name : 'ovicFileSize'
} )
export class OvicFileSizePipe implements PipeTransform {

	constructor( private fileService : FileService ) {}

	transform( file : OvicFileSever | OvicFileStore | OvicDriveFile | File | any ) : string {
		return this.fileService.getFileSize( file );
	}

}
