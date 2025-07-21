import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
	console.log = () => {};
	console.debug = () => {};
	console.warn = () => {};
}

platformBrowser()
	.bootstrapModule(AppModule)
	.catch((err) => console.error(err));
