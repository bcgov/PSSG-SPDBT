import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { OAuthModule } from 'angular-oauth2-oidc';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ApiModule } from './api/api.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LandingComponent } from './landing.component';
import { MaterialModule } from './material.module';
import { SharedModule } from './shared/shared.module';
import { environment } from './../environments/environment';

@NgModule({
  declarations: [AppComponent, LandingComponent],
  imports: [
    AppRoutingModule,
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    OAuthModule.forRoot({
      resourceServer: {
        customUrlValidation: (url) => url.startsWith('/api') && !url.endsWith('/configuration'),
        sendAccessToken: true,
      },
    }),
    ApiModule.forRoot({ rootUrl: '' }),
    SharedModule,
  ],
  providers: [
    provideHotToastConfig(),
    { provide: APP_BASE_HREF, useFactory: getBaseLocation },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

export function getBaseLocation() {
  const paths: string[] = location.pathname.split('/').splice(1, 1);
  const basePath: string = environment.production ? (paths?.[0]) || '' : '';
  return '/' + basePath;
}

