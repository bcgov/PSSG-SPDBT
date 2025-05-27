import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Optional, SkipSelf } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { AuthProcessService } from './services/auth-process.service';
import { AuthUserBcscService } from './services/auth-user-bcsc.service';
import { AuthenticationService } from './services/authentication.service';
import { CommonApplicationService } from './services/common-application.service';
import { ConfigService } from './services/config.service';
import { FileUtilService } from './services/file-util.service';
import { UtilService } from './services/util.service';

const CORE_COMPONENTS: any[] = [];

@NgModule({
	declarations: [...CORE_COMPONENTS],
	imports: [CommonModule, RouterModule, ReactiveFormsModule],
	providers: [
		CommonApplicationService,
		AuthProcessService,
		AuthUserBcscService,
		AuthenticationService,
		ConfigService,
		FileUtilService,
		UtilService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ErrorInterceptor,
			multi: true,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: LoaderInterceptor,
			multi: true,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthTokenInterceptor,
			multi: true,
		},
	],
	exports: [...CORE_COMPONENTS],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CoreModule {
	constructor(@Optional() @SkipSelf() coreModule: CoreModule) {
		if (coreModule) {
			throw new Error(`CoreModule has already been loaded. Import Core modules in the AppModule only.`);
		}
	}
}
