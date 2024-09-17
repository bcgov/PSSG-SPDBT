import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Optional, SkipSelf } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { ApplicationService } from './services/application.service';
import { AuthProcessService } from './services/auth-process.service';
import { AuthUserBceidService } from './services/auth-user-bceid.service';
import { AuthUserBcscService } from './services/auth-user-bcsc.service';
import { AuthenticationService } from './services/authentication.service';
import { BusinessApplicationService } from './services/business-application.service';
import { ConfigService } from './services/config.service';
import { ControllingMemberCrcService } from './services/controlling-member-crc.service';
import { FileUtilService } from './services/file-util.service';
import { WorkerApplicationService } from './services/worker-application.service';
import { PermitApplicationService } from './services/permit-application.service';
import { UtilService } from './services/util.service';

const CORE_COMPONENTS: any[] = [];

@NgModule({
	declarations: [...CORE_COMPONENTS],
	imports: [CommonModule, RouterModule, ReactiveFormsModule],
	providers: [
		ApplicationService,
		AuthProcessService,
		AuthUserBceidService,
		AuthUserBcscService,
		AuthenticationService,
		BusinessApplicationService,
		ControllingMemberCrcService,
		ConfigService,
		FileUtilService,
		WorkerApplicationService,
		PermitApplicationService,
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
