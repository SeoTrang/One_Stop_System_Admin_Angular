import { enableProdMode , ENVIRONMENT_INITIALIZER , inject } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '@app/app.module';
import { environment } from '@env';

if ( environment.production ) {
	enableProdMode();
}

platformBrowserDynamic().bootstrapModule( AppModule ).then(ref => {
	// Ensure Angular destroys itself on hot reloads.
	if (window['ngRef']) {
		window['ngRef'].destroy();
	}
	window['ngRef'] = ref;
	// Otherwise, log the boot error
}).catch( err => console.error( err ) );
